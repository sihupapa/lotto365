'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'

interface WinningNumber {
  id: string
  draw_no: number
  numbers: number[]
  bonus: number
  prize_1st: number | null
  winner_count_1st: number | null
  draw_date: string
}

const BALL_COLOR = (n: number) => {
  if (n <= 10) return 'bg-yellow-400 text-yellow-900'
  if (n <= 20) return 'bg-blue-500 text-white'
  if (n <= 30) return 'bg-red-500 text-white'
  if (n <= 40) return 'bg-gray-600 text-white'
  return 'bg-green-500 text-white'
}

export default function WinningPage() {
  const [winnings, setWinnings] = useState<WinningNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/public/winning-numbers?limit=20')
      .then((r) => r.json())
      .then(({ data }) => {
        setWinnings(data?.winning_numbers ?? [])
        setLoading(false)
      })
  }, [])

  async function syncLatest() {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/collect-winning`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        }
      )
      const json = await res.json()
      if (json.collected) {
        setSyncMsg(`✅ ${json.collected}회 당첨번호 수집 완료!`)
        const refreshed = await fetch('/api/v1/public/winning-numbers?limit=20').then((r) => r.json())
        setWinnings(refreshed.data?.winning_numbers ?? [])
      } else {
        setSyncMsg(json.message ?? '최신 상태입니다.')
      }
    } catch {
      setSyncMsg('수집 실패. 잠시 후 다시 시도하세요.')
    }
    setSyncing(false)
  }

  return (
    <div>
      <PageHeader
        title="당첨 관리"
        desc="로또 6/45 당첨번호를 관리합니다"
        action={
          <div className="flex items-center gap-3">
            {syncMsg && (
              <span className="text-sm text-green-400">{syncMsg}</span>
            )}
            <button
              onClick={syncLatest}
              disabled={syncing}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {syncing ? '수집 중...' : '🔄 최신 회차 수집'}
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                {['회차', '추첨일', '당첨번호', '보너스', '1등 당첨금', '1등 인원'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {winnings.map((w) => (
                <tr key={w.id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-orange-400 font-bold">{w.draw_no}회</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(w.draw_date).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {w.numbers.map((n) => (
                        <div
                          key={n}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${BALL_COLOR(n)}`}
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-7 h-7 rounded-full border-2 border-gray-600 flex items-center justify-center text-xs font-bold text-gray-300">
                      {w.bonus}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-yellow-400 font-semibold">
                    {w.prize_1st
                      ? `${(w.prize_1st / 100000000).toFixed(1)}억`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {w.winner_count_1st !== null ? `${w.winner_count_1st}명` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
