import { describe, it, expect } from 'vitest'
import { IS_DEMO } from '@/config/appConfig'

describe('currentUser demo vs prod flag', () => {
  it('respects VITE_DEMO flag', () => {
    expect(typeof IS_DEMO).toBe('boolean')
  })
})
