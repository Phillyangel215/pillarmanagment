import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null
function client() {
  if (!supabase) {
    supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL || 'https://ponclzjxzgoizmfvdzog.supabase.co',
      import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      {
        auth: { 
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
  }
  return supabase
}

export async function login(email: string, password: string) {
  const { error } = await client().auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function register(email: string, password: string) {
  const { error } = await client().auth.signUp({ email, password })
  if (error) throw error
}

export async function resetPassword(email: string) {
  const origin = window.location.origin
  const { error } = await client().auth.resetPasswordForEmail(email, { redirectTo: origin })
  if (error) throw error
}
