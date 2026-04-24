import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

type CookieItem = { name: string; value: string; options?: Record<string, unknown> }

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/login')) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieItem[]) {
          cookiesToSet.forEach((cookie) =>
            request.cookies.set(cookie.name, cookie.value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach((cookie) =>
            response.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
