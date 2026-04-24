'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: { mode: string; count: number }[]
}

const MODE_LABEL: Record<string, string> = {
  random: '🎲 랜덤',
  manual: '✏️ 수동',
  analysis: '📊 분석',
  dream: '🌙 꿈해몽',
}

const COLORS = ['#f97316', '#60a5fa', '#a78bfa', '#34d399']

export default function DrawModeChart({ data }: Props) {
  const formatted = data.map((d) => ({
    name: MODE_LABEL[d.mode] ?? d.mode,
    value: d.count,
  }))

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-sm font-semibold text-white mb-1">번호 생성 모드 분포</p>
      <p className="text-xs text-gray-500 mb-4">전체 기간</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={formatted}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {formatted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            itemStyle={{ color: '#f9fafb', fontSize: 12 }}
            formatter={(value: number) => [`${value.toLocaleString()}회`, '']}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
