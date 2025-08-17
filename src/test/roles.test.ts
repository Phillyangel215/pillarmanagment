import { describe, it, expect, beforeEach } from 'vitest'
import { getDevRoles } from '@/components/common/RoleSwitcher'

describe('dev roles storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to empty roles', () => {
    expect(getDevRoles()).toEqual([])
  })
})

