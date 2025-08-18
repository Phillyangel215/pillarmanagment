import { Role } from '@/auth/rbac'

// TODO: replace with real session decode later
export function getCurrentUserRoles(): Role[] {
	try {
		const raw = localStorage.getItem('dev.roles')
		if (raw) return JSON.parse(raw)
	} catch {
		// intentionally ignore JSON/Storage errors in dev stub
	}
	return [Role.SUPER_ADMIN] // dev default
}
