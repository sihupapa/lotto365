import { NextRequest } from 'next/server'
import { createServerClient } from '@lotto/db'
import { getAuthUser } from '@/lib/supabase'
import { ok, fail, unauthorized } from '@/lib/response'

export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const mode = searchParams.get('mode')
  const limit = 20

  const client = createServerClient()
  let query = client
    .from('draws')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (mode) query = query.eq('mode', mode)

  const { data, count } = await query
  return ok({ draws: data, total: count, page })
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const body = await req.json()
  const { id, is_favorited } = body
  if (!id || typeof is_favorited !== 'boolean') return fail('잘못된 요청입니다.')

  const client = createServerClient()
  const { error } = await client
    .from('draws')
    .update({ is_favorited })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return fail('업데이트 실패')
  return ok({ updated: true })
}
