'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DailyStats {
  date: string
  dau: number
  total_draws: number
  new_users: number
}

interface Props {
  data: DailyStats[]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function DauChart({ data }: Props) {
  const formatted = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({ ...d, date: formatDate(d.date) }))

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-sm font-semibold text-white mb-1">일간 활성 사용자 (DAU)</p>
      <p className="text-xs text-gray-500 mb-5">최근 30일</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af', fontSize: 12 }}
            itemStyle={{ color: '#f97316' }}
          />
          <Line
            type="monotone"
            dataKey="dau"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#f97316' }}
            name="DAU"
          />
          <Line
            type="monotone"
            dataKey="new_users"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#60a5fa' }}
            name="신규 가입"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-orange-500 rounded" />
          <span className="text-xs text-gray-400">DAU</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-blue-400 rounded" />
          <span className="text-xs text-gray-400">신규 가입</span>
        </div>
      </div>
    </div>
  )
}
