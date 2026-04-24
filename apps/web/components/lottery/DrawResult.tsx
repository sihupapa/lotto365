'use client'

import { useState } from 'react'
import LottoBall from './LottoBall'

interface DrawResultProps {
  numbers: number[]
  meta?: { reasoning?: string; keywords?: string[] }
  onFavorite?: (favorited: boolean) => void
  isFavorited?: boolean
  drawId?: string
}

export default function DrawResult({
  numbers,
  meta,
  onFavorite,
  isFavorited = false,
  drawId,
}: DrawResultProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [copying, setCopying] = useState(false)

  async function toggleFavorite() {
    if (!drawId) return
    const next = !favorited
    setFavorited(next)
    await fetch('/api/v1/user/history', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: drawId, is_favorited: next }),
    })
    onFavorite?.(next)
  }

  async function copyNumbers() {
    await navigator.clipboard.writeText(numbers.join(', '))
    setCopying(true)
    setTimeout(() => setCopying(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {numbers.map((n) => (
            <LottoBall key={n} number={n} size="md" />
          ))}
        </div>
        <div className="flex gap-2 ml-2 shrink-0">
          <button
            onClick={copyNumbers}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title="복사"
          >
            {copying ? '✓' : '📋'}
          </button>
          {drawId && (
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-lg transition-colors hover:bg-gray-50"
              title={favorited ? '즐겨찾기 해제' : '즐겨찾기'}
            >
              {favorited ? '⭐' : '☆'}
            </button>
          )}
        </div>
      </div>

      {meta?.keywords && meta.keywords.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-2">
          {meta.keywords.map((kw) => (
            <span key={kw} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
              #{kw}
            </span>
          ))}
        </div>
      )}

      {meta?.reasoning && (
        <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3 mt-2">
          {meta.reasoning}
        </p>
      )}
    </div>
  )
}
