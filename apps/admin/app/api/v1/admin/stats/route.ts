import { NextRequest } from 'next/server'
import { createServerClient } from '@lotto/db'
import { ok } from '@/lib/response'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'overview'

  const client = createServerClient()

  if (type === 'overview') {
    const [users, draws, points] = await Promise.all([
      client.from('profiles').select('id', { count: 'exact', head: true }),
      client.from('draws').select('id', { count: 'exact', head: true }),
      client.from('point_transactions').select('amount').eq('type', 'earn_ad'),
    ])

    const totalAdRevenue = (points.data ?? []).reduce((sum, t) => sum + t.amount, 0)

    return ok({
      total_users: users.count ?? 0,
      total_draws: draws.count ?? 0,
      total_ad_revenue: totalAdRevenue,
    })
  }

  if (type === 'dau') {
    const { data } = await client
      .from('daily_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)
    return ok({ daily: data })
  }

  return ok({})
}
