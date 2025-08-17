import React from 'react'
import { can, Role } from '@/auth/rbac'
import { getDevRoles } from './RoleSwitcher'
import { createAccount } from '@/services/accounts'

export default function CreateUserButton() {
  const roles: Role[] = getDevRoles()
  const allowed = can(roles, 'accounts', 'create')
  if (!allowed) return null

  const onClick = async () => {
    try {
      await createAccount({ email: 'demo@example.org' })
      alert('User created (demo)')
    } catch (e) {
      alert(String(e))
    }
  }

  return (
    <button onClick={onClick} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">
      Create User
    </button>
  )
}

