import { describe, it, expect, vi, beforeEach } from 'vitest'
import { provisionUser } from '@/features/admin/useProvisionUser'

describe('provisionUser', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('posts to /api/accounts with payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, id: '123' }) })
    vi.stubGlobal('fetch', fetchMock)
    const res = await provisionUser({ email: 'e@x.com', password: 'pw', roles: ['SUPER_ADMIN'] })
    expect(res.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalled()
  })
})

