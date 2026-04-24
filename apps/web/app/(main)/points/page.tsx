'use client'

import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  type: string
  amount: number
  balance_after: number
  created_at: string
}

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  earn_ad: { label: '광고 시청', color: 'text-green-600' },
  earn_event: { label: '이벤트 참여', color: 'text-blue-600' },
  earn_login: { label: '출석 체크', color: 'text-purple-600' },
  earn_signup: { label: '회원가입 보너스', color: 'text-orange-600' },
  spend_draw: { label: '번호 생성', color: 'text-red-500' },
  spend_premium: { label: '프리미엄 구매', color: 'text-red-500' },
  admin_grant: { label: '관리자 지급', color: 'text-blue-600' },
}

export default function PointsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [adLoading, setAdLoading] = useState(false)
  const [adMsg, setAdMsg] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/user/profile').then((r) => r.json()),
      fetch('/api/v1/user/points').then((r) => r.json()),
    ]).then(([profile, points]) => {
      setBalance(profile.data?.profile?.point_balance ?? 0)
      setTransactions(points.data?.transactions ?? [])
      setLoading(false)
    })
  }, [])

  async function watchAd() {
    setAdLoading(true)
    setAdMsg(null)
    // 실제 광고 SDK 연동 위치 (AdSense/AdMob)
    await new Promise((r) => setTimeout(r, 1500))
    const res = await fetch('/api/v1/user/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'earn_ad' }),
    })
    const json = await res.json()
    if (json.success) {
      setBalance((prev) => (prev ?? 0) + 10)
      setAdMsg('+10P 적립되었습니다!')
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          type: 'earn_ad',
          amount: 10,
          balance_after: (balance ?? 0) + 10,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])
    }
    setAdLoading(false)
  }

  return (
    <div>
      {/* 잔액 카드 */}
      <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl p-5 text-white mb-6">
        <p className="text-sm opacity-80 mb-1">보유 포인트</p>
        <p className="text-4xl font-bold mb-4">
          {balance !== null ? balance.toLocaleString() : '...'}<span className="text-xl ml-1">P</span>
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white/20 rounded-xl p-3">
            <p className="opacity-80 mb-1">랜덤 번호 생성</p>
            <p className="font-bold">10P 차감</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="opacity-80 mb-1">꿈 해몽 추천</p>
            <p className="font-bold">30P 차감</p>
          </div>
        </div>
      </div>

      {/* 광고 시청 포인트 적립 */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">광고 시청</p>
            <p className="text-xs text-gray-500 mt-0.5">광고를 보고 포인트를 적립하세요</p>
            {adMsg && <p className="text-xs text-green-600 mt-1 font-semibold">{adMsg}</p>}
          </div>
          <button
            onClick={watchAd}
            disabled={adLoading}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
          >
            {adLoading ? '⏳' : '+10P'}
          </button>
        </div>
      </div>

      {/* 거래 내역 */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">포인트 내역</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">내역이 없습니다</div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const info = TYPE_LABEL[tx.type] ?? { label: tx.type, color: 'text-gray-600' }
            const isEarn = tx.amount > 0
            return (
              <div
                key={tx.id}
                className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{info.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(tx.created_at).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isEarn ? 'text-green-600' : 'text-red-500'}`}>
                    {isEarn ? '+' : ''}{tx.amount}P
                  </p>
                  <p className="text-xs text-gray-400">{tx.balance_after.toLocaleString()}P</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
