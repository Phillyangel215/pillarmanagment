import { can } from '@/auth/rbac'
import { getCurrentUserRoles } from '@/auth/currentUser'
import { useNotifications } from '@/hooks/useNotifications'

export function NotificationBadge() {
  const { unread, loading } = useNotifications()
  const userRoles = getCurrentUserRoles()
  
  // RBAC guard: only show if user can read notifications
  if (!can(userRoles, 'notifications', 'read')) {
    return null
  }

  if (loading) {
    return (
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
    )
  }

  if (unread === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
        {unread > 99 ? '99+' : unread}
      </div>
    </div>
  )
}
