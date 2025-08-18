import React from 'react'
import { useUnreadCount } from '@/features/notifications/useNotifications'
import { can, Role } from '@/auth/rbac'
import { getCurrentUserRoles } from '@/auth/currentUser'

export default function NotificationBell() {
  const roles = getCurrentUserRoles()
  const allowed = can(roles, 'notifications', 'read')
  const { count, loading } = useUnreadCount()

  if (!allowed) return null

  return (
    <button
      aria-label="Notifications"
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2"
    >
      <span aria-hidden>🔔</span>
      {!loading && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}
