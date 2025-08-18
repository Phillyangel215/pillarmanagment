// Minimal stub for audit logs (no web imports)
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const app = new Hono()
app.use('*', cors())

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

type AuditEvent = {
  id?: string
  ts: string
  user?: string
  scope: string
  action: string
  details?: unknown
  prev_hash?: string
  hash?: string
}

app.post('/audit', async c => {
  const event = await c.req.json<AuditEvent>()
  const { data: prev } = await supabase.from('audit_logs').select('hash').order('ts', { ascending: false }).limit(1).maybeSingle()
  const prev_hash = prev?.hash ?? ''
  const input = JSON.stringify({ ...event, prev_hash })
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  const payload = { ...event, prev_hash, hash }
  const { error } = await supabase.from('audit_logs').insert(payload)
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ ok: true })
})

app.get('/audit', async c => {
  const url = new URL(c.req.url)
  const scope = url.searchParams.get('scope') || undefined
  const user = url.searchParams.get('user') || undefined
  const since = url.searchParams.get('since') || undefined
  let query = supabase.from('audit_logs').select('*').order('ts', { ascending: false })
  if (scope) query = query.eq('scope', scope)
  if (user) query = query.eq('user', user)
  if (since) query = query.gte('ts', since)
  const { data, error } = await query
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

export default app

