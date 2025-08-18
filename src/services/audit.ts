import { loadDB, saveDB } from '@/demo/store'

export type AuditEvent = {
  ts: string
  user?: string
  scope: string
  action: string
  details?: unknown
  prev_hash?: string
  hash?: string
}

type AuditDB = { events: AuditEvent[] }

function getDB(): AuditDB {
  return loadDB<AuditDB>({ events: [] })
}

function sha256Hex(input: string): string {
  // Browser-compatible sync SHA: fallback simple hash for demo; not cryptographically strong
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0
  }
  return `demo_${(h >>> 0).toString(16)}`
}

export async function appendEvent(event: Omit<AuditEvent, 'hash' | 'prev_hash'>): Promise<AuditEvent> {
  const db = getDB()
  const prev_hash = db.events[db.events.length - 1]?.hash ?? ''
  const input = JSON.stringify({ ...event, prev_hash })
  const hash = sha256Hex(input)
  const rec: AuditEvent = { ...event, prev_hash, hash }
  db.events.push(rec)
  saveDB(db)
  return rec
}

export function listEvents(filters?: Partial<Pick<AuditEvent, 'scope' | 'user'>> & { since?: string }): AuditEvent[] {
  const db = getDB()
  let out = db.events.slice()
  if (filters?.scope) out = out.filter(e => e.scope === filters.scope)
  if (filters?.user) out = out.filter(e => e.user === filters.user)
  if (filters?.since) out = out.filter(e => e.ts >= (filters.since as string))
  return out
}

export function exportCSV(rows: AuditEvent[]): string {
  const header = ['ts', 'user', 'scope', 'action', 'details', 'prev_hash', 'hash']
  const toCell = (v: unknown) => {
    if (v === null || v === undefined) return ''
    if (typeof v === 'object') return JSON.stringify(v)
    return String(v)
  }
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(header.map(k => toCell((r as unknown as Record<string, unknown>)[k])).join(','))
  }
  return lines.join('\n')
}

