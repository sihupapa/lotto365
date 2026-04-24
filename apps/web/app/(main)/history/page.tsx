'use client'

import { useEffect, useState } from 'react'
import DrawResult from '@/components/lottery/DrawResult'

interface Draw {
  id: string
  numbers: number[]
  mode: string
  meta: { keywords?: string[]; reasoning?: string } | null
  is_favorited: boolean
  created_at: string
}

const MODE_LABEL: Record<string, string> = {
  random: '🎲 랜덤',
  manual: '✏️ 수동',
  analysis: '📊 분석',
  dream: '🌙 꿈해몽',
}

export default function HistoryPage() {
  const [draws, setDraws] = useState<Draw[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('mode', filter)
    fetch(`/api/v1/user/history?${params}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setDraws(data.draws ?? [])
        setTotal(data.total ?? 0)
      })
      .finally(() => setLoading(false))
  }, [filter])

  const FILTERS = [
    { value: 'all', label: '전체' },
    { value: 'random', label: '랜덤' },
    { value: 'manual', label: '수동' },
    { value: 'analysis', label: '분석' },
    { value: 'dream', label: '꿈해몽' },
    { value: 'favorite', label: '⭐즐겨찾기' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">번호 이력</h1>
        <span className="text-sm text-gray-400">총 {total}개</span>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : draws.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm">아직 생성한 번호가 없어요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {draws.map((draw) => (
            <div key={draw.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400">{MODE_LABEL[draw.mode]}</span>
                <span className="text-xs text-gray-400">
                  {new Date(draw.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <DrawResult
                numbers={draw.numbers}
                drawId={draw.id}
                isFavorited={draw.is_favorited}
                meta={draw.meta ?? undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
