import { Hono } from 'npm:hono'

const app = new Hono()

app.get('/', (c) => c.json({ status: 'ok' }))
app.get('/health', (c) => c.json({ status: 'healthy', ts: new Date().toISOString() }))

export default app

// Deno deploy entrypoint
// deno-lint-ignore no-explicit-any
;(globalThis as any).Deno?.serve?.(app.fetch)

