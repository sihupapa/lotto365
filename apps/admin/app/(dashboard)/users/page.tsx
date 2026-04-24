'use client'

import { useEffect, useState, useCallback } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import UserTable from '@/components/tables/UserTable'

interface User {
  id: string
  nickname: string | null
  email: string | null
  provider: string | null
  role: string
  plan: string
  point_balance: number
  is_ad_removed: boolean
  created_at: string
  last_login_at: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pointModal, setPointModal] = useState<{ userId: string; name: string } | null>(null)
  const [grantAmount, setGrantAmount] = useState('')
  const [grantMsg, setGrantMsg] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    const res = await fetch(`/api/v1/admin/users?${params}`)
    const json = await res.json()
    setUsers(json.data?.users ?? [])
    setTotal(json.data?.total ?? 0)
    setLoading(false)
  }, [page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  async function handleUpdate(id: string, field: string, value: unknown) {
    await fetch(`/api/v1/admin/users?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    await fetchUsers()
  }

  async function handleGrantPoints() {
    if (!pointModal || !grantAmount) return
    await fetch(`/api/v1/admin/points?user_id=${pointModal.userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(grantAmount), type: 'admin_grant' }),
    })
    setGrantMsg(`${grantAmount}P 지급 완료!`)
    setGrantAmount('')
    await fetchUsers()
  }

  const totalPages = Math.ceil(total / 30)

  return (
    <div>
      <PageHeader
        title="사용자 관리"
        desc={`전체 ${total.toLocaleString()}명`}
      />

      {/* 검색 */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="닉네임으로 검색..."
          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={fetchUsers}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          검색
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : (
        <>
          <UserTable users={users} onUpdate={handleUpdate} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    p === page
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* 포인트 지급 모달 */}
      {pointModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80">
            <h3 className="text-white font-bold mb-1">포인트 지급</h3>
            <p className="text-gray-400 text-sm mb-4">{pointModal.name}에게 포인트를 지급합니다.</p>
            <input
              type="number"
              value={grantAmount}
              onChange={(e) => setGrantAmount(e.target.value)}
              placeholder="지급할 포인트 입력"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {grantMsg && <p className="text-green-400 text-sm mb-3">{grantMsg}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setPointModal(null); setGrantMsg(null) }}
                className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm"
              >
                취소
              </button>
              <button
                onClick={handleGrantPoints}
                className="flex-1 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm"
              >
                지급
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
