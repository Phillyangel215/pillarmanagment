import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchNotifications, fetchUnreadCount, markNotificationRead } from '@/services/notifications'

describe('notifications service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('fetchNotifications returns array shape', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ([])}))
    const res = await fetchNotifications()
    expect(Array.isArray(res)).toBe(true)
  })

  it('fetchUnreadCount returns count', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 3 })}))
    const res = await fetchUnreadCount()
    expect(res.count).toBeTypeOf('number')
  })

  it('markNotificationRead posts to endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', fetchMock)
    const res = await markNotificationRead('1')
    expect(res.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalled()
  })
})

