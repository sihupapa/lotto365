'use client'

import { useState } from 'react'
import GenerateTabs from '@/components/lottery/GenerateTabs'
import DrawResult from '@/components/lottery/DrawResult'

interface Draw {
  id: string
  numbers: number[]
}

export default function RandomPage() {
  const [count, setCount] = useState(1)
  const [draws, setDraws] = useState<Draw[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pointCost, setPointCost] = useState<number | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/v1/user/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'random', count }),
    })
    const json = await res.json()
    setLoading(false)

    if (!json.success) {
      setError(json.message ?? '생성 실패')
      return
    }
    setDraws(json.data.draws)
    setPointCost(json.data.point_cost)
  }

  return (
    <div>
      <GenerateTabs />

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="font-bold text-gray-900 mb-1">랜덤 번호 생성</h2>
        <p className="text-sm text-gray-500 mb-5">1~45 사이 6개 번호를 무작위로 추출합니다.</p>

        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            생성 개수 <span className="text-orange-500">{count}게임</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {[1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">차감 포인트</span>
          <span className="text-sm font-bold text-orange-500">{count * 10}P</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚙️</span> 생성 중...
            </span>
          ) : (
            `🎲 번호 생성 (-${count * 10}P)`
          )}
        </button>
      </div>

      {draws.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-sm">생성된 번호</h3>
            {pointCost && (
              <span className="text-xs text-orange-500">-{pointCost}P 차감</span>
            )}
          </div>
          {draws.map((draw, i) => (
            <div key={draw.id}>
              <p className="text-xs text-gray-400 mb-1.5">{i + 1}게임</p>
              <DrawResult numbers={draw.numbers} drawId={draw.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
