import { useState, useEffect } from 'react'
import { listNotifications, unreadCount, markRead, type Notification } from '@/services/notifications'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const [notificationsData, unreadCountData] = await Promise.all([
          listNotifications(controller.signal),
          unreadCount(controller.signal)
        ])
        
        setNotifications(notificationsData)
        setUnread(unreadCountData)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await markRead(id)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setUnread(prev => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read')
    }
  }

  return {
    notifications,
    unread,
    loading,
    error,
    markAsRead
  }
}
