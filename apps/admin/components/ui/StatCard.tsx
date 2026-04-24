interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: string
  trend?: { value: number; label: string }
  color?: 'orange' | 'blue' | 'green' | 'purple'
}

const COLOR = {
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export default function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
  color = 'orange',
}: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${COLOR[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend.value >= 0
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm opacity-70">{label}</p>
      {sub && <p className="text-xs opacity-50 mt-1">{sub}</p>}
    </div>
  )
}
