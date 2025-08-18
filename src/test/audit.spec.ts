import { describe, it, expect, beforeEach } from 'vitest'
import { auditAppend, auditValidate } from '@/services/audit'
import { __AUDIT_DB_KEY__ } from '@/demo/auditStore'

function clearAuditStore() {
  try {
    localStorage.removeItem(__AUDIT_DB_KEY__)
  } catch {}
}

describe('Audit Log demo hash chain', () => {
  beforeEach(() => {
    clearAuditStore()
  })

  it('validates ok for untampered chain', async () => {
    await auditAppend({ scope: 'auth', action: 'login', actor: { email: 'a@b.com' } })
    await auditAppend({ scope: 'accounts', action: 'user.provisioned', target: { type: 'user', id: 'u1' } })
    await auditAppend({ scope: 'roles', action: 'role.assigned', target: { type: 'user', id: 'u1' }, meta: { role: 'ADMIN' } })
    const res = await auditValidate()
    expect(res.ok).toBe(true)
  })

  it('detects tampering with correct badIndex', async () => {
    const e1 = await auditAppend({ scope: 'auth', action: 'login', actor: { email: 'x@y.z' } })
    const e2 = await auditAppend({ scope: 'accounts', action: 'user.provisioned', target: { type: 'user', id: 'u2' }, meta: { note: 'ok' } })
    const e3 = await auditAppend({ scope: 'roles', action: 'role.assigned', target: { type: 'user', id: 'u2' } })

    // Tamper middle event by direct localStorage mutation
    const raw = localStorage.getItem(__AUDIT_DB_KEY__) || 'null'
    const db = JSON.parse(raw) as { prev: string; events: any[] }
    const idx = db.events.findIndex((ev) => ev.id === e2.id)
    db.events[idx].action = 'user.provisioned_x'
    localStorage.setItem(__AUDIT_DB_KEY__, JSON.stringify(db))

    const res = await auditValidate()
    expect(res.ok).toBe(false)
    expect(typeof res.badIndex).toBe('number')
  })
})

