import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@lotto/db'
import { ok, fail } from '@/lib/response'

const eventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['point_reward', 'draw_bonus', 'ad_free']),
  reward_point: z.number().int().min(0),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  is_active: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  const client = createServerClient()
  const { data, count } = await client
    .from('events')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  return ok({ events: data, total: count, page })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? '잘못된 요청입니다.')

  const client = createServerClient()
  const { data, error } = await client
    .from('events')
    .insert({ ...parsed.data, created_by: body.admin_id })
    .select()
    .single()

  if (error) return fail('이벤트 생성 실패')
  return ok({ event: data }, 201)
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return fail('이벤트 ID가 필요합니다.')

  const body = await req.json()
  const parsed = eventSchema.partial().safeParse(body)
  if (!parsed.success) return fail('잘못된 요청입니다.')

  const client = createServerClient()
  const { error } = await client.from('events').update(parsed.data).eq('id', id)

  if (error) return fail('업데이트 실패')
  return ok({ updated: true })
}
