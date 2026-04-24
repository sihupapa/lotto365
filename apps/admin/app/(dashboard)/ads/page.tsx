'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_WEEKLY = [
  { day: '월', views: 420, earned: 4200 },
  { day: '화', views: 380, earned: 3800 },
  { day: '수', views: 510, earned: 5100 },
  { day: '목', views: 470, earned: 4700 },
  { day: '금', views: 620, earned: 6200 },
  { day: '토', views: 810, earned: 8100 },
  { day: '일', views: 730, earned: 7300 },
]

export default function AdsPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const totalViews = MOCK_WEEKLY.reduce((s, d) => s + d.views, 0)
  const totalEarned = MOCK_WEEKLY.reduce((s, d) => s + d.earned, 0)

  return (
    <div>
      <PageHeader title="광고 수익" desc="광고 시청 통계 및 포인트 적립 현황" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon="👁️" label="이번 주 광고 시청" value={totalViews.toLocaleString()} sub="회" color="blue" trend={{ value: 14, label: '전주 대비' }} />
        <StatCard icon="🪙" label="이번 주 적립 포인트" value={`${(totalEarned / 1000).toFixed(1)}K`} sub="P" color="orange" />
        <StatCard icon="👤" label="광고 시청 사용자" value="1,240" sub="명 (중복 제외)" color="green" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-semibold text-sm">요일별 광고 시청 수</p>
          <div className="flex gap-2">
            {(['week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  period === p ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {p === 'week' ? '주간' : '월간'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MOCK_WEEKLY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              itemStyle={{ color: '#f97316' }}
            />
            <Bar dataKey="views" fill="#f97316" radius={[4, 4, 0, 0]} name="시청 수" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <p className="text-sm font-semibold text-white mb-4">일별 상세 내역</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['요일', '광고 시청', '적립 포인트', '평균/회'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {MOCK_WEEKLY.map((d) => (
                <tr key={d.day} className="hover:bg-gray-800/30">
                  <td className="px-3 py-2.5 text-white font-medium">{d.day}요일</td>
                  <td className="px-3 py-2.5 text-gray-300">{d.views.toLocaleString()}회</td>
                  <td className="px-3 py-2.5 text-orange-400 font-semibold">{d.earned.toLocaleString()}P</td>
                  <td className="px-3 py-2.5 text-gray-400">{Math.round(d.earned / d.views)}P</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
