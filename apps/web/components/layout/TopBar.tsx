'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TopBar() {
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/v1/user/profile')
      .then((r) => r.json())
      .then(({ data }) => setPoints(data?.profile?.point_balance ?? 0))
      .catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/generate/random" className="flex items-center gap-2">
          <span className="text-2xl">🍀</span>
          <span className="font-bold text-gray-900">행운번호</span>
        </Link>
        <Link
          href="/points"
          className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-sm font-semibold px-3 py-1.5 rounded-full"
        >
          <span>🪙</span>
          <span>{points !== null ? `${points.toLocaleString()}P` : '...'}</span>
        </Link>
      </div>
    </header>
  )
}
