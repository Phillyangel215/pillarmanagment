import { can, Role } from '@/auth/rbac'

describe('RBAC: notifications', () => {
  it('SUPER_ADMIN can read notifications', () => {
    expect(can(Role.SUPER_ADMIN, 'notifications', 'read')).toBe(true)
  })
  it('CLIENT can read own notifications', () => {
    expect(can(Role.CLIENT, 'notifications', 'read')).toBe(true)
  })
})
