import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

type SessionUser = {
  id: string
  email?: string
  roles: string[]
}

export type AppSession = {
  user: SessionUser | null
}

let supabaseClient: ReturnType<typeof createClient> | null = null
function getClient() {
  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL || 'https://ponclzjxzgoizmfvdzog.supabase.co'
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    supabaseClient = createClient(url, anon, {
      auth: { 
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseClient
}

export async function fetchSession(): Promise<AppSession> {
  const supabase = getClient()
  const { data } = await supabase.auth.getSession()
  let roles: string[] = []
  const metadata = data.session?.user?.app_metadata as Record<string, unknown> | undefined
  if (metadata && Array.isArray(metadata.roles)) {
    roles = metadata.roles as string[]
  }
  return {
    user: data.session?.user
      ? { id: data.session.user.id, email: data.session.user.email ?? undefined, roles }
      : null,
  }
}

export function useSession(): AppSession {
  const [session, setSession] = useState<AppSession>({ user: null })
  useEffect(() => {
    let mounted = true
    fetchSession().then((s) => {
      if (mounted) setSession(s)
    })
    const supabase = getClient()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      fetchSession().then((s) => {
        if (mounted) setSession(s)
      })
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])
  return session
}
