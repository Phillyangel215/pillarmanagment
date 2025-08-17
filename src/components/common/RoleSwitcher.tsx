import React, { useEffect, useState } from 'react'
import { Role } from '@/auth/rbac'

const STORAGE_KEY = '__demo_roles__'

export default function RoleSwitcher() {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try { setRoles(JSON.parse(raw)) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roles))
    window.dispatchEvent(new CustomEvent('demo:roles-changed'))
  }, [roles])

  const toggleRole = (role: Role) => {
    setRoles((prev) => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])
  }

  if (import.meta.env.PROD) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs opacity-70">Roles:</span>
      {Object.values(Role).map((r) => (
        <button
          key={r}
          onClick={() => toggleRole(r)}
          className={[
            'px-2 py-1 rounded border text-xs',
            roles.includes(r) ? 'bg-green-500/20 border-green-500/40' : 'bg-white/5 border-white/10'
          ].join(' ')}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

export function getDevRoles(): Role[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

