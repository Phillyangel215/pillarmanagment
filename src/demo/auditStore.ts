import type { AuditEvent } from '@/demo/audit'

const KEY = 'audit.db.v1'
type AuditDB = { prev: string; events: AuditEvent[] }

function load(): AuditDB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AuditDB
  } catch {}
  return { prev: 'GENESIS', events: [] }
}

function persist(db: AuditDB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {}
}

let db: AuditDB = load()

export function getAll(): AuditEvent[] {
  const latest = load()
  return latest.events.slice().reverse()
}
export function clearAll() {
  db = { prev: 'GENESIS', events: [] }
  persist(db)
}
export function save() {
  persist(db)
}
export function getPrevHash() {
  return db.prev
}
export function setPrevHash(h: string) {
  db.prev = h
  save()
}
export function pushEvent(ev: AuditEvent) {
  db.events.push(ev)
  db.prev = ev.hash
  save()
}

// Test helper: expose raw key name
export const __AUDIT_DB_KEY__ = KEY

