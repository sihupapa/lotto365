'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'

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

interface Props {
  users: User[]
  onUpdate: (id: string, field: string, value: unknown) => Promise<void>
}

const PROVIDER_ICON: Record<string, string> = { kakao: '🟡', google: '🔵', naver: '🟢' }

export default function UserTable({ users, onUpdate }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleUpdate(id: string, field: string, value: unknown) {
    setUpdating(id)
    await onUpdate(id, field, value)
    setUpdating(null)
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/50">
            {['사용자', '가입경로', '플랜', '포인트', '역할', '마지막 접속', '액션'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-900/30 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="text-white font-medium">{user.nickname ?? '(미설정)'}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-base">{PROVIDER_ICON[user.provider ?? ''] ?? '⚪'}</span>
                <span className="text-gray-400 text-xs ml-1">{user.provider}</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.plan === 'premium' ? 'orange' : 'gray'}>
                  {user.plan === 'premium' ? '프리미엄' : '무료'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <span className="text-orange-400 font-mono font-semibold">
                  {user.point_balance.toLocaleString()}P
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.role === 'admin' ? 'red' : 'blue'}>
                  {user.role === 'admin' ? '관리자' : '유저'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {user.last_login_at
                  ? new Date(user.last_login_at).toLocaleDateString('ko-KR')
                  : '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <select
                    defaultValue={user.plan}
                    disabled={updating === user.id}
                    onChange={(e) => handleUpdate(user.id, 'plan', e.target.value)}
                    className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="free">무료</option>
                    <option value="premium">프리미엄</option>
                  </select>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleUpdate(user.id, 'role', 'admin')}
                      disabled={updating === user.id}
                      className="text-xs px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      관리자 설정
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
