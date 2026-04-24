'use client'

import { useEffect, useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import DauChart from '@/components/charts/DauChart'
import DrawModeChart from '@/components/charts/DrawModeChart'
import PageHeader from '@/components/ui/PageHeader'

interface Overview {
  total_users: number
  total_draws: number
  total_ad_revenue: number
}

interface DailyStat {
  date: string
  dau: number
  new_users: number
  total_draws: number
}

const MOCK_MODE_DATA = [
  { mode: 'random', count: 4820 },
  { mode: 'manual', count: 1230 },
  { mode: 'analysis', count: 980 },
  { mode: 'dream', count: 560 },
]

export default function OverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [daily, setDaily] = useState<DailyStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/admin/stats?type=overview').then((r) => r.json()),
      fetch('/api/v1/admin/stats?type=dau').then((r) => r.json()),
    ]).then(([ov, dau]) => {
      setOverview(ov.data)
      setDaily(dau.data?.daily ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    )
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  return (
    <div>
      <PageHeader title="대시보드" desc={dateStr} />

      {/* 핵심 지표 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="전체 사용자"
          value={(overview?.total_users ?? 0).toLocaleString()}
          sub="누적"
          color="blue"
          trend={{ value: 12, label: '전주 대비' }}
        />
        <StatCard
          icon="🎲"
          label="번호 생성"
          value={(overview?.total_draws ?? 0).toLocaleString()}
          sub="누적"
          color="orange"
          trend={{ value: 8, label: '전주 대비' }}
        />
        <StatCard
          icon="🪙"
          label="오늘 DAU"
          value={daily[0]?.dau?.toLocaleString() ?? '0'}
          color="green"
          trend={{ value: 5, label: '어제 대비' }}
        />
        <StatCard
          icon="📢"
          label="광고 수익"
          value={`${((overview?.total_ad_revenue ?? 0) / 1000).toFixed(1)}K P`}
          sub="포인트 환산"
          color="purple"
        />
      </div>

      {/* 차트 2개 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <DauChart data={daily} />
        </div>
        <div>
          <DrawModeChart data={MOCK_MODE_DATA} />
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: '/users', icon: '👥', label: '사용자 관리' },
          { href: '/events', icon: '🎉', label: '이벤트 등록' },
          { href: '/winning', icon: '🏆', label: '당첨 관리' },
          { href: '/notices', icon: '📣', label: '공지 작성' },
        ].map(({ href, icon, label }) => (
          <a
            key={href}
            href={href}
            className="bg-gray-900 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors group"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs text-gray-400 group-hover:text-orange-400 font-medium transition-colors">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
