import { createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@lotto/db'

type CookieItem = { name: string; value: string; options?: Record<string, unknown> }

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieItem[]) {
          try {
            cookiesToSet.forEach((cookie) =>
              cookieStore.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>)
            )
          } catch {}
        },
      },
    }
  )
}
