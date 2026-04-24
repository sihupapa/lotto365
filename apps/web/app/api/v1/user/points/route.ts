import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@lotto/db'
import { getAuthUser } from '@/lib/supabase'
import { ok, fail, unauthorized } from '@/lib/response'

const earnSchema = z.object({ type: z.enum(['earn_ad', 'earn_login']) })

export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  const client = createServerClient()
  const { data, count } = await client
    .from('point_transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  return ok({ transactions: data, total: count, page })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const body = await req.json()
  const parsed = earnSchema.safeParse(body)
  if (!parsed.success) return fail('잘못된 요청입니다.')

  const EARN_AMOUNT: Record<string, number> = { earn_ad: 10, earn_login: 5 }
  const amount = EARN_AMOUNT[parsed.data.type]

  const client = createServerClient()
  await client.rpc('add_points', {
    p_user_id: user.id,
    p_amount: amount,
    p_type: parsed.data.type,
  })

  return ok({ earned: amount, message: `${amount}P 적립되었습니다.` })
}
