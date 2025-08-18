import { canonical, sha256 } from '@/demo/hash'
import { getPrevHash, pushEvent, getAll } from '@/demo/auditStore'
import type { AuditEvent } from '@/demo/audit'

function tinyUuid(): string {
  // RFC4122-ish; sufficient for demo
  const rnd = (n = 16) => crypto.getRandomValues(new Uint8Array(n))
  const b = rnd()
  // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

export async function auditAppend(partial: Omit<AuditEvent, 'id' | 'ts' | 'hash' | 'prev_hash'>): Promise<AuditEvent> {
  const prev = getPrevHash()
  const base: AuditEvent = {
    id: tinyUuid(),
    ts: new Date().toISOString(),
    ...partial,
    prev_hash: prev,
    hash: '',
  }
  const payload = canonical(base)
  const hash = await sha256(prev + payload)
  base.hash = hash
  pushEvent(base)
  return base
}

export async function auditList(params?: { scope?: string; action?: string; q?: string }): Promise<AuditEvent[]> {
  let items = getAll()
  if (params?.scope) items = items.filter((i) => i.scope === params.scope)
  if (params?.action) items = items.filter((i) => i.action === params.action)
  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter((i) => JSON.stringify(i).toLowerCase().includes(q))
  }
  return items
}

export async function auditValidate(): Promise<{ ok: boolean; badIndex?: number }> {
  const list = getAll().slice().reverse()
  let prev = 'GENESIS'
  for (let i = 0; i < list.length; i++) {
    const ev = list[i]
    if (ev.prev_hash !== prev) return { ok: false, badIndex: i }
    const payload = canonical({ ...ev })
    const h = await sha256(prev + payload)
    if (h !== ev.hash) return { ok: false, badIndex: i }
    prev = ev.hash
  }
  return { ok: true }
}

