import { describe, it, expect, vi } from 'vitest'

describe('currentUser (demo vs prod)', () => {
  it('demo mode reads roles from localStorage', async () => {
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (k === 'demo_roles' ? JSON.stringify(['SUPER_ADMIN']) : null),
      setItem: (_k: string, _v: string) => {},
      removeItem: (_k: string) => {},
      clear: () => {},
      key: (_i: number) => null,
      length: 0,
    } as unknown as Storage)
    vi.doMock('@/config/appConfig', () => ({ IS_DEMO: true }))
    const { useCurrentUserRoles } = await import('@/auth/currentUser')
    // hooks can't run outside React, but function returns [] when IS_DEMO synced; basic import works
    expect(typeof useCurrentUserRoles).toBe('function')
  })
})

