'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Profile {
  id: string
  nickname: string | null
  email: string | null
  avatar_url: string | null
  provider: string | null
  plan: string
  point_balance: number
  is_ad_removed: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [nickname, setNickname] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/v1/user/profile')
      .then((r) => r.json())
      .then(({ data }) => {
        setProfile(data.profile)
        setNickname(data.profile.nickname ?? '')
        setAvatarPreview(data.profile.avatar_url)
      })
  }, [])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (error) {
      setMessage({ type: 'error', text: '이미지 업로드 실패' })
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarPreview(data.publicUrl)
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    const body: Record<string, string> = { nickname }
    if (avatarPreview && avatarPreview !== profile?.avatar_url) {
      body.avatar_url = avatarPreview
    }

    const res = await fetch('/api/v1/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()

    if (json.success) {
      setProfile(json.data.profile)
      setMessage({ type: 'success', text: '프로필이 저장되었습니다.' })
    } else {
      setMessage({ type: 'error', text: json.message ?? '저장 실패' })
    }
    setSaving(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const PROVIDER_LABEL: Record<string, string> = {
    kakao: '카카오',
    google: 'Google',
    naver: '네이버',
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">프로필 설정</h1>

      {/* 아바타 */}
      <div className="flex flex-col items-center mb-8">
        <button onClick={() => fileRef.current?.click()} className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 ring-4 ring-orange-100">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                👤
              </div>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-medium">변경</span>
          </div>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <p className="text-xs text-gray-400 mt-2">프로필 사진 변경</p>
      </div>

      {/* 정보 카드 */}
      <div className="bg-orange-50 rounded-xl p-4 mb-6 flex justify-between text-sm">
        <div>
          <span className="text-gray-500">로그인</span>
          <p className="font-semibold text-gray-800 mt-0.5">
            {PROVIDER_LABEL[profile.provider ?? ''] ?? profile.provider}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-500">플랜</span>
          <p className="font-semibold text-orange-600 mt-0.5">
            {profile.plan === 'premium' ? '프리미엄' : '무료'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-500">포인트</span>
          <p className="font-semibold text-gray-800 mt-0.5">
            {profile.point_balance.toLocaleString()}P
          </p>
        </div>
      </div>

      {/* 닉네임 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="닉네임을 입력하세요 (2~20자)"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{nickname.length}/20</p>
      </div>

      {/* 이메일 (읽기 전용) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
        <input
          type="text"
          value={profile.email ?? ''}
          readOnly
          className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400"
        />
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || nickname.length < 2}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors mb-3"
      >
        {saving ? '저장 중...' : '저장하기'}
      </button>

      <button
        onClick={handleSignOut}
        className="w-full py-3 text-gray-400 hover:text-gray-600 text-sm transition-colors"
      >
        로그아웃
      </button>
    </div>
  )
}
