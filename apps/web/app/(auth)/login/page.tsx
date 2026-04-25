'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Provider } from '@supabase/supabase-js'

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function signIn(provider: 'google' | 'kakao' | 'naver') {
    setLoading(provider)
    setError(null)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const redirectTo = `${window.location.origin}/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo,
        scopes: provider === 'kakao' ? 'profile_nickname profile_image' : undefined,
      },
    })
    if (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍀</div>
          <h1 className="text-2xl font-bold text-gray-900">로또 번호 생성기</h1>
          <p className="text-sm text-gray-500 mt-1">간편 로그인으로 시작하세요</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signIn('kakao')}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-yellow-900 font-semibold rounded-xl transition-colors"
          >
            <KakaoIcon />
            {loading === 'kakao' ? '로그인 중...' : '카카오로 로그인'}
          </button>

          <button
            onClick={() => signIn('naver')}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            <NaverIcon />
            {loading === 'naver' ? '로그인 중...' : '네이버로 로그인'}
          </button>

          <button
            onClick={() => signIn('google')}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors"
          >
            <GoogleIcon />
            {loading === 'google' ? '로그인 중...' : 'Google로 로그인'}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          로그인 시 서비스 이용약관 및 개인정보처리방침에 동의합니다.
        </p>
      </div>
    </div>
  )
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.568 1.524 4.82 3.84 6.196L4.8 21l4.592-2.4C10.2 18.864 11.088 19 12 19c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
