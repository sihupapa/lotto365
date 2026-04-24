import { NextRequest, NextResponse } from 'next/server'

/**
 * 네이버는 Supabase 기본 제공 provider가 아니므로
 * Custom OAuth Provider로 처리합니다.
 * Supabase 대시보드 > Auth > Providers > Custom 에서 설정 필요.
 *
 * 현재는 Supabase의 일반 /callback 흐름으로 리다이렉트합니다.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=naver_no_code', request.url))
  }

  const callbackUrl = new URL('/callback', request.url)
  callbackUrl.searchParams.set('code', code)
  if (state) callbackUrl.searchParams.set('state', state)

  return NextResponse.redirect(callbackUrl)
}
