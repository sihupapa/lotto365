type BadgeVariant = 'green' | 'red' | 'blue' | 'orange' | 'gray' | 'purple'

const VARIANT: Record<BadgeVariant, string> = {
  green: 'bg-green-500/20 text-green-400',
  red: 'bg-red-500/20 text-red-400',
  blue: 'bg-blue-500/20 text-blue-400',
  orange: 'bg-orange-500/20 text-orange-400',
  gray: 'bg-gray-500/20 text-gray-400',
  purple: 'bg-purple-500/20 text-purple-400',
}

export default function Badge({
  children,
  variant = 'gray',
}: {
  children: React.ReactNode
  variant?: BadgeVariant
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${VARIANT[variant]}`}>
      {children}
    </span>
  )
}
