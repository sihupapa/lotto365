'use client'

import { useState } from 'react'
import GenerateTabs from '@/components/lottery/GenerateTabs'
import DrawResult from '@/components/lottery/DrawResult'
import LottoBall from '@/components/lottery/LottoBall'

interface Draw {
  id: string
  numbers: number[]
}

const ALL_NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1)

export default function ManualPage() {
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<Draw | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(n: number) {
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n)
      if (prev.length >= 6) return prev
      return [...prev, n].sort((a, b) => a - b)
    })
  }

  function reset() {
    setSelected([])
    setResult(null)
    setError(null)
  }

  async function submit() {
    if (selected.length !== 6) return
    setLoading(true)
    setError(null)
    const res = await fetch('/api/v1/user/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'manual', numbers: selected }),
    })
    const json = await res.json()
    setLoading(false)
    if (!json.success) {
      setError(json.message ?? '제출 실패')
      return
    }
    setResult(json.data.draws[0])
  }

  return (
    <div>
      <GenerateTabs />

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="font-bold text-gray-900 mb-1">수동 번호 선택</h2>
        <p className="text-sm text-gray-500 mb-5">원하는 숫자 6개를 직접 골라보세요.</p>

        {/* 선택된 번호 미리보기 */}
        <div className="flex gap-2 justify-center mb-5 min-h-[48px]">
          {selected.length === 0 ? (
            <p className="text-sm text-gray-300 self-center">번호를 선택하세요</p>
          ) : (
            selected.map((n) => <LottoBall key={n} number={n} size="md" />)
          )}
          {Array.from({ length: 6 - selected.length }, (_, i) => (
            <div
              key={i}
              className="w-11 h-11 rounded-full border-2 border-dashed border-gray-200"
            />
          ))}
        </div>

        {/* 번호 그리드 */}
        <div className="grid grid-cols-9 gap-1.5 mb-5">
          {ALL_NUMBERS.map((n) => {
            const isSelected = selected.includes(n)
            const isDisabled = selected.length >= 6 && !isSelected
            return (
              <button
                key={n}
                onClick={() => toggle(n)}
                disabled={isDisabled}
                className={`
                  aspect-square rounded-full text-sm font-bold transition-all
                  ${isSelected
                    ? 'bg-orange-500 text-white scale-110 shadow-md'
                    : isDisabled
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                  }
                `}
              >
                {n}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">
            {selected.length}/6 선택 · 차감 5P
          </span>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
            초기화
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={selected.length !== 6 || loading}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
        >
          {loading ? '저장 중...' : `✏️ 번호 저장 (-5P)`}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm">저장된 번호</h3>
          <DrawResult numbers={result.numbers} drawId={result.id} />
        </div>
      )}
    </div>
  )
}
