'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/generate/random', label: '🎲 랜덤' },
  { href: '/generate/manual', label: '✏️ 수동' },
  { href: '/generate/analysis', label: '📊 분석' },
  { href: '/generate/dream', label: '🌙 꿈해몽' },
]

export default function GenerateTabs() {
  const pathname = usePathname()

  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
      {TABS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
            pathname === href
              ? 'bg-white text-orange-500 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
