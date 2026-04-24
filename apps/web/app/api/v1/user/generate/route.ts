import { NextRequest } from 'next/server'
import { z } from 'zod'
import { generateRandom, validateManual, generateByAnalysis, buildWeights } from '@lotto/engine'
import { interpretDream } from '@lotto/ai'
import { createServerClient } from '@lotto/db'
import { getAuthUser, createSupabaseServerClient } from '@/lib/supabase'
import { ok, fail, unauthorized } from '@/lib/response'

const POINT_COST: Record<string, number> = {
  random: 10,
  manual: 5,
  analysis: 20,
  dream: 30,
}

const schema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('random'), count: z.number().int().min(1).max(5).default(1) }),
  z.object({ mode: z.literal('manual'), numbers: z.array(z.number()).length(6) }),
  z.object({ mode: z.literal('analysis'), count: z.number().int().min(1).max(5).default(1) }),
  z.object({ mode: z.literal('dream'), dreamText: z.string().min(10).max(500) }),
])

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? '잘못된 요청입니다.')

  const { mode } = parsed.data
  const cost = POINT_COST[mode]

  const supabase = await createSupabaseServerClient()

  // 포인트 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('point_balance')
    .eq('id', user.id)
    .single()

  if (!profile || profile.point_balance < cost) {
    return fail('포인트가 부족합니다.', 402)
  }

  let numbers: number[][] = []
  let meta: Record<string, unknown> = {}

  if (mode === 'random') {
    numbers = generateRandom(parsed.data.count)
  } else if (mode === 'manual') {
    const validation = validateManual(parsed.data.numbers)
    if (!validation.ok) return fail(validation.error ?? '유효하지 않은 번호입니다.')
    numbers = [parsed.data.numbers.sort((a, b) => a - b)]
  } else if (mode === 'analysis') {
    const serverClient = createServerClient()
    const { data: history } = await serverClient
      .from('winning_numbers')
      .select('numbers')
      .order('draw_no', { ascending: false })
      .limit(100)
    const winningHistory = (history ?? []).map((r) => r.numbers)
    const weights = buildWeights(winningHistory, winningHistory.length)
    numbers = generateByAnalysis(weights, parsed.data.count)
    meta = { basis: '최근 100회 당첨번호 빈도 분석' }
  } else if (mode === 'dream') {
    const result = await interpretDream(parsed.data.dreamText)
    numbers = [result.numbers]
    meta = { keywords: result.keywords, reasoning: result.reasoning }
  }

  // 포인트 차감 + 번호 저장 (트랜잭션)
  const serverClient = createServerClient()
  const draws = await Promise.all(
    numbers.map((nums) =>
      serverClient
        .from('draws')
        .insert({ user_id: user.id, numbers: nums, mode, meta })
        .select()
        .single()
    )
  )

  await serverClient.rpc('deduct_points', {
    p_user_id: user.id,
    p_amount: cost,
    p_type: 'spend_draw',
  })

  const remaining = profile.point_balance - cost

  return ok({
    draws: draws.map((d) => d.data),
    point_cost: cost,
    remaining_points: remaining,
    meta,
  })
}
