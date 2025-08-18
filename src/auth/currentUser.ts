import { IS_DEMO } from '@/config/appConfig'
import { useSession } from '@/auth/session'
import { Role } from '@/auth/rbac'

export function useCurrentUserRoles(): Role[] {
  const session = useSession()
  if (IS_DEMO) {
    try {
      const raw = localStorage.getItem('demo_roles')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
      }
    } catch {
      /* noop */
    }
    return []
  }
  return session.roles
}

