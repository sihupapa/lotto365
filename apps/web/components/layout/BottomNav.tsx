'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/generate/random', icon: '🎲', label: '번호생성' },
  { href: '/winning', icon: '🏆', label: '당첨확인' },
  { href: '/history', icon: '📋', label: '내역' },
  { href: '/profile', icon: '👤', label: '내정보' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 safe-bottom">
      <div className="max-w-lg mx-auto flex">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href.split('/').slice(0, 3).join('/'))
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors ${
                active ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
