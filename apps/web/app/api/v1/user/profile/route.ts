import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@lotto/db'
import { getAuthUser } from '@/lib/supabase'
import { ok, fail, unauthorized } from '@/lib/response'

const updateSchema = z.object({
  nickname: z.string().min(2).max(20).optional(),
  avatar_url: z.string().url().optional(),
})

export async function GET() {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const client = createServerClient()
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return fail('프로필을 불러올 수 없습니다.', 500)
  return ok({ profile: data })
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? '잘못된 요청입니다.')

  const client = createServerClient()
  const { data, error } = await client
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id)
    .select()
    .single()

  if (error) return fail('프로필 업데이트 실패', 500)
  return ok({ profile: data })
}
