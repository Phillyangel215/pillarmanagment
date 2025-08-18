import React from 'react'
import { can, Role } from '@/auth/rbac'
import { getCurrentUserRoles } from '@/auth/currentUser'

export default function CreateUserButton() {
  const roles = getCurrentUserRoles()
  if (!can(roles, 'accounts', 'create')) return null
  return (
    <button
      className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
      onClick={() => alert('Provisioning dialog would open here (SUPER_ADMIN only).')}
    >
      Create User
    </button>
  )
}

