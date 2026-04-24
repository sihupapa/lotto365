interface LottoBallProps {
  number: number
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

function getBallColor(n: number) {
  if (n <= 10) return 'bg-yellow-400 text-yellow-900'
  if (n <= 20) return 'bg-blue-500 text-white'
  if (n <= 30) return 'bg-red-500 text-white'
  if (n <= 40) return 'bg-gray-600 text-white'
  return 'bg-green-500 text-white'
}

const SIZE = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
}

export default function LottoBall({ number, size = 'md', animate = false }: LottoBallProps) {
  return (
    <div
      className={`
        ${SIZE[size]} ${getBallColor(number)}
        rounded-full flex items-center justify-center
        font-bold shadow-md select-none
        ${animate ? 'animate-bounce' : ''}
      `}
    >
      {number}
    </div>
  )
}
