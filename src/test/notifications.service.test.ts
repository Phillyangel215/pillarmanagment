import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as svc from '@/services/notifications'

describe('notifications service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('list returns items shape', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ items: [] }) } as any)
    const items = await svc.listNotifications()
    expect(Array.isArray(items)).toBe(true)
  })

  it('unreadCount returns number', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ count: 3 }) } as any)
    const n = await svc.getUnreadCount()
    expect(n).toBe(3)
  })
})
