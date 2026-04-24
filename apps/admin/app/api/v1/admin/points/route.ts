import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@lotto/db'
import { ok, fail } from '@/lib/response'

const grantSchema = z.object({
  amount: z.number().int().min(1).max(100000),
  type: z.enum(['admin_grant']).default('admin_grant'),
  note: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  if (!userId) return fail('사용자 ID가 필요합니다.')

  const body = await req.json()
  const parsed = grantSchema.safeParse(body)
  if (!parsed.success) return fail('잘못된 요청입니다.')

  const client = createServerClient()
  await client.rpc('add_points', {
    p_user_id: userId,
    p_amount: parsed.data.amount,
    p_type: parsed.data.type,
  })

  return ok({ granted: parsed.data.amount })
}

export async function GET() {
  const client = createServerClient()
  const { data } = await client
    .from('point_transactions')
    .select('*, profiles(nickname, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return ok({ transactions: data })
}
