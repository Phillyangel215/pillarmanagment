import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Role } from '@/auth/rbac'
import { IS_DEMO } from '@/config/appConfig'

export type SessionInfo = { userId: string | null; roles: Role[] }

export async function fetchSession(): Promise<SessionInfo> {
  if (IS_DEMO) return { userId: null, roles: [] }
  const { data } = await supabase.auth.getSession()
  const roles = (data.session?.user?.app_metadata?.roles ?? []) as string[]
  return { userId: data.session?.user?.id ?? null, roles: roles.filter(Boolean) as Role[] }
}

export function useSession(): SessionInfo {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({ userId: null, roles: [] })
  useEffect(() => {
    if (IS_DEMO) return
    fetchSession().then(setSessionInfo)
    const { data: subscription } = supabase.auth.onAuthStateChange(() => fetchSession().then(setSessionInfo))
    return () => subscription.subscription.unsubscribe()
  }, [])
  return sessionInfo
}

