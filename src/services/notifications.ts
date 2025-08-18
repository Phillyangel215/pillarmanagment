import { IS_DEMO, API_BASE } from '@/config/appConfig'
import { api } from '@/lib/http'

export type Notification = {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp: string
  actionUrl?: string
}

export async function fetchNotifications(): Promise<Notification[]> {
  if (IS_DEMO) {
    return []
  }
  return api<Notification[]>(`${API_BASE}/notifications`)
}

export async function fetchUnreadCount(): Promise<{ count: number }> {
  if (IS_DEMO) {
    return { count: 0 }
  }
  return api<{ count: number }>(`${API_BASE}/notifications/unread-count`)
}

export async function markNotificationRead(id: string): Promise<{ ok: true }> {
  if (IS_DEMO) {
    return { ok: true }
  }
  return api<{ ok: true }>(`${API_BASE}/notifications/mark-read/${encodeURIComponent(id)}`, {
    method: 'POST',
  })
}

