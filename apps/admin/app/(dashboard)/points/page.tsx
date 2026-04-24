'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'

interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  balance_after: number
  created_at: string
  profiles: { nickname: string | null; email: string | null } | null
}

const TYPE_LABEL: Record<string, { label: string; variant: 'green' | 'red' | 'blue' | 'orange' | 'gray' }> = {
  earn_ad: { label: '광고 시청', variant: 'green' },
  earn_event: { label: '이벤트', variant: 'blue' },
  earn_login: { label: '출석 체크', variant: 'green' },
  earn_signup: { label: '회원가입', variant: 'orange' },
  spend_draw: { label: '번호 생성', variant: 'red' },
  spend_premium: { label: '프리미엄', variant: 'red' },
  admin_grant: { label: '관리자 지급', variant: 'purple' as 'blue' },
}

export default function PointsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/admin/points')
      .then((r) => r.json())
      .then(({ data }) => {
        setTransactions(data?.transactions ?? [])
        setLoading(false)
      })
  }, [])

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalSpent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  return (
    <div>
      <PageHeader title="포인트 관리" desc="전체 사용자의 포인트 거래 내역" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="text-xs text-green-400 mb-1">총 적립 포인트</p>
          <p className="text-2xl font-bold text-white">+{totalEarned.toLocaleString()}P</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-xs text-red-400 mb-1">총 소모 포인트</p>
          <p className="text-2xl font-bold text-white">-{totalSpent.toLocaleString()}P</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                {['사용자', '유형', '포인트', '잔액', '일시'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transactions.map((tx) => {
                const info = TYPE_LABEL[tx.type] ?? { label: tx.type, variant: 'gray' as const }
                return (
                  <tr key={tx.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{tx.profiles?.nickname ?? '(미설정)'}</p>
                      <p className="text-gray-500 text-xs">{tx.profiles?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={info.variant}>{info.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}P
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {tx.balance_after.toLocaleString()}P
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(tx.created_at).toLocaleDateString('ko-KR', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
