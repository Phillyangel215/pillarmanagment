import { useEffect, useState } from 'react'
import { Role } from '@/auth/rbac'

const STORAGE_KEY = '__demo_roles__'

function readRoles(): Role[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const roles = JSON.parse(raw)
		return Array.isArray(roles) ? roles : []
	} catch {
		return []
	}
}

export function useDevRoles(): Role[] {
	const [roles, setRoles] = useState<Role[]>([])

	useEffect(() => {
		setRoles(readRoles())
		const handler = () => setRoles(readRoles())
		window.addEventListener('demo:roles-changed', handler)
		window.addEventListener('demo:reset', handler)
		return () => {
			window.removeEventListener('demo:roles-changed', handler)
			window.removeEventListener('demo:reset', handler)
		}
	}, [])

	return roles
}

