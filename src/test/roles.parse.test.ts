import { getCurrentUserRoles } from '@/auth/currentUser'
import { Role } from '@/auth/rbac'

describe('dev roles parsing', () => {
  it('defaults to SUPER_ADMIN when localStorage empty', () => {
    localStorage.removeItem('dev.roles')
    expect(getCurrentUserRoles()).toEqual([Role.SUPER_ADMIN])
  })
})

