import { IS_DEMO } from '@/config/appConfig'
import { supabase } from '@/lib/supabase'

export async function login(email: string, password: string) {
  if (IS_DEMO) {
    return { error: null }
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error }
}

export async function register(email: string, password: string) {
  if (IS_DEMO) {
    return { error: null }
  }
  const { error } = await supabase.auth.signUp({ email, password })
  return { error }
}

export async function resetPassword(email: string) {
  if (IS_DEMO) {
    return { error: null }
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
  return { error }
}

export async function logout() {
  if (IS_DEMO) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}

