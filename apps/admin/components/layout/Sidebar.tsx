'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const NAV = [
  { href: '/overview', icon: '📊', label: '대시보드' },
  { href: '/users', icon: '👥', label: '사용자 관리' },
  { href: '/events', icon: '🎉', label: '이벤트 관리' },
  { href: '/winning', icon: '🏆', label: '당첨 관리' },
  { href: '/points', icon: '🪙', label: '포인트 관리' },
  { href: '/ads', icon: '📢', label: '광고 수익' },
  { href: '/notices', icon: '📣', label: '공지사항' },
  { href: '/settings', icon: '⚙️', label: '시스템 설정' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-gray-900 border-r border-gray-800 flex flex-col z-20">
      {/* 로고 */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍀</span>
          <div>
            <p className="text-white font-bold text-sm">행운번호</p>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
        >
          <span>🚪</span>
          로그아웃
        </button>
      </div>
    </aside>
  )
}
