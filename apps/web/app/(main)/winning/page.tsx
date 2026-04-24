'use client'

import { useEffect, useState } from 'react'
import LottoBall from '@/components/lottery/LottoBall'

interface WinningNumber {
  draw_no: number
  numbers: number[]
  bonus: number
  prize_1st: number | null
  winner_count_1st: number | null
  draw_date: string
}

export default function WinningPage() {
  const [winnings, setWinnings] = useState<WinningNumber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/public/winning-numbers?limit=10')
      .then((r) => r.json())
      .then(({ data }) => setWinnings(data.winning_numbers ?? []))
      .finally(() => setLoading(false))
  }, [])

  const latest = winnings[0]

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 mb-4">당첨 번호</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : (
        <>
          {/* 최신 회차 강조 */}
          {latest && (
            <div className="bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl p-5 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium opacity-90">최신 당첨번호</p>
                  <p className="text-2xl font-bold">{latest.draw_no}회</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">추첨일</p>
                  <p className="text-sm font-semibold">
                    {new Date(latest.draw_date).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {latest.numbers.map((n) => (
                  <div
                    key={n}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-white border border-white/30"
                  >
                    {n}
                  </div>
                ))}
                <div className="flex items-center text-white/60 text-sm px-1">+</div>
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/50 flex items-center justify-center font-bold text-white">
                  {latest.bonus}
                </div>
              </div>

              {latest.prize_1st && (
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">1등 당첨금</span>
                    <span className="font-bold">
                      {(latest.prize_1st / 100000000).toFixed(1)}억원
                    </span>
                  </div>
                  {latest.winner_count_1st !== null && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="opacity-80">1등 당첨자</span>
                      <span className="font-bold">{latest.winner_count_1st}명</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 역대 목록 */}
          <h2 className="text-sm font-semibold text-gray-700 mb-3">역대 당첨번호</h2>
          <div className="space-y-3">
            {winnings.slice(1).map((w) => (
              <div key={w.draw_no} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">{w.draw_no}회</span>
                  <span className="text-xs text-gray-400">
                    {new Date(w.draw_date).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  {w.numbers.map((n) => (
                    <LottoBall key={n} number={n} size="sm" />
                  ))}
                  <span className="text-gray-300 text-sm">+</span>
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-500">
                    {w.bonus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
