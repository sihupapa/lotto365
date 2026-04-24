import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const res = await fetch('/api/v1/user/profile')
  const json = await res.json()
  return json.success ? json.data.profile : null
}

export async function signOut() {
  await supabase.auth.signOut()
}
