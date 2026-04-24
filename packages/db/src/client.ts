import { createClient as supabaseCreateClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return supabaseCreateClient<Database>(url, key)
}

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return supabaseCreateClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
