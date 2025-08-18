import { describe, it, expect, vi } from 'vitest'
import { createAccount } from '@/services/accounts'

describe('accounts service', () => {
  it('POST /api/accounts with payload', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ id: 'abc' }) } as any)
    const res = await createAccount({ email: 'a@b.com', password: 'p', roles: ['CLIENT'] })
    expect(res.id).toBe('abc')
    expect(fetchSpy).toHaveBeenCalled()
  })
})
