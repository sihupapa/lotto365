import { NextRequest } from 'next/server'
import { createServerClient } from '@lotto/db'
import { ok } from '@/lib/response'

export const revalidate = 3600 // ISR 1시간

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit') ?? 10)

  const client = createServerClient()
  const { data } = await client
    .from('winning_numbers')
    .select('*')
    .order('draw_no', { ascending: false })
    .limit(limit)

  return ok({ winning_numbers: data })
}
