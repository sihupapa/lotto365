import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@lotto/db'
import { ok, fail } from '@/lib/response'

const updateSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  plan: z.enum(['free', 'premium']).optional(),
  is_ad_removed: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const search = searchParams.get('search') ?? ''
  const limit = 30

  const client = createServerClient()
  let query = client
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) query = query.ilike('nickname', `%${search}%`)

  const { data, count } = await query
  return ok({ users: data, total: count, page })
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('id')
  if (!userId) return fail('사용자 ID가 필요합니다.')

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return fail('잘못된 요청입니다.')

  const client = createServerClient()
  const { error } = await client.from('profiles').update(parsed.data).eq('id', userId)

  if (error) return fail('업데이트 실패')
  return ok({ updated: true })
}
