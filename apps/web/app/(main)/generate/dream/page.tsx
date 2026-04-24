'use client'

import { useState } from 'react'
import GenerateTabs from '@/components/lottery/GenerateTabs'
import DrawResult from '@/components/lottery/DrawResult'

interface DreamDraw {
  id: string
  numbers: number[]
}

const DREAM_EXAMPLES = ['돼지가 나타났어요', '하늘을 날았어요', '뱀을 밟았어요', '황금이 가득했어요']

export default function DreamPage() {
  const [dreamText, setDreamText] = useState('')
  const [result, setResult] = useState<DreamDraw | null>(null)
  const [meta, setMeta] = useState<{ keywords?: string[]; reasoning?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'input' | 'result'>('input')

  async function interpret() {
    if (dreamText.trim().length < 10) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/v1/user/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'dream', dreamText: dreamText.trim() }),
    })
    const json = await res.json()
    setLoading(false)

    if (!json.success) {
      setError(json.message ?? '해몽 실패')
      return
    }
    setResult(json.data.draws[0])
    setMeta(json.data.meta)
    setStep('result')
  }

  function reset() {
    setDreamText('')
    setResult(null)
    setMeta(null)
    setError(null)
    setStep('input')
  }

  return (
    <div>
      <GenerateTabs />

      {step === 'input' ? (
        <div>
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">🌙 꿈 해몽 번호 추천</p>
            <p className="text-xs text-purple-600">
              어젯밤 꿈 내용을 자세히 적어주세요. AI가 꿈을 분석해 행운 번호를 찾아드립니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              꿈 내용 입력
            </label>
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="꿈에서 무슨 일이 있었나요? 최대한 자세히 적어주세요. (최소 10자)"
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                {dreamText.length < 10 && dreamText.length > 0
                  ? `${10 - dreamText.length}자 더 입력하세요`
                  : ''}
              </span>
              <span className="text-xs text-gray-400">{dreamText.length}/500</span>
            </div>

            {/* 예시 버튼 */}
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">예시 꿈</p>
              <div className="flex flex-wrap gap-2">
                {DREAM_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setDreamText((prev) => (prev ? prev + ' ' + ex : ex))}
                    className="text-xs px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs text-gray-400">차감 포인트</span>
            <span className="text-sm font-bold text-orange-500">30P</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={interpret}
            disabled={dreamText.trim().length < 10 || loading}
            className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-pulse">🔮</span>
                AI가 꿈을 해몽 중...
              </span>
            ) : (
              '🌙 꿈 해몽하기 (-30P)'
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* 꿈 내용 요약 */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2">꿈 내용</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {dreamText.length > 100 ? dreamText.slice(0, 100) + '...' : dreamText}
            </p>
          </div>

          {result && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm">해몽 결과 번호</h3>
              <DrawResult
                numbers={result.numbers}
                drawId={result.id}
                meta={meta ?? undefined}
              />
            </div>
          )}

          <button
            onClick={reset}
            className="w-full mt-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors text-sm"
          >
            다시 해몽하기
          </button>
        </div>
      )}
    </div>
  )
}
