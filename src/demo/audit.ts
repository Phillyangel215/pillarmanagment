export type AuditEvent = {
  id: string
  ts: string
  actor?: { id?: string; email?: string; roles?: string[] }
  scope: string
  action: string
  target?: { type?: string; id?: string; label?: string }
  meta?: Record<string, unknown>
  hash: string
  prev_hash: string
}

export type AuditPage = { items: AuditEvent[]; nextCursor?: string }

