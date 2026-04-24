'use client'

import { useState } from 'react'
import GenerateTabs from '@/components/lottery/GenerateTabs'
import DrawResult from '@/components/lottery/DrawResult'

interface Draw {
  id: string
  numbers: number[]
}

const ANALYSIS_INFO = [
  { icon: '📈', label: '빈출 번호 분석', desc: '최근 100회 자주 나온 번호 반영' },
  { icon: '⏳', label: '미출 번호 추적', desc: '오래 나오지 않은 번호 포함' },
  { icon: '⚖️', label: '홀짝 균형', desc: '홀짝 비율 자동 조정' },
]

export default function AnalysisPage() {
  const [count, setCount] = useState(1)
  const [draws, setDraws] = useState<Draw[]>([])
  const [meta, setMeta] = useState<{ basis?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    setDraws([])
    const res = await fetch('/api/v1/user/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'analysis', count }),
    })
    const json = await res.json()
    setLoading(false)
    if (!json.success) {
      setError(json.message ?? '생성 실패')
      return
    }
    setDraws(json.data.draws)
    setMeta(json.data.meta)
  }

  return (
    <div>
      <GenerateTabs />

      {/* 분석 방법 안내 */}
      <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
        <p className="text-xs font-semibold text-blue-700 mb-3">📊 분석 방법</p>
        <div className="space-y-2">
          {ANALYSIS_INFO.map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-2.5 items-start">
              <span className="text-base">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="font-bold text-gray-900 mb-1">통계 분석 추천</h2>
        <p className="text-sm text-gray-500 mb-5">
          역대 당첨번호 데이터를 과학적으로 분석해 번호를 추천합니다.
        </p>

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
          <span className="text-sm font-bold text-orange-500">{count * 20}P</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⚙️</span> 분석 중...
            </span>
          ) : (
            `📊 분석 추천 받기 (-${count * 20}P)`
          )}
        </button>
      </div>

      {draws.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-sm">추천 번호</h3>
            {meta?.basis && (
              <span className="text-xs text-blue-500">{meta.basis}</span>
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
