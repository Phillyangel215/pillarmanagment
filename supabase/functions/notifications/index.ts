import { Hono } from 'npm:hono'

const app = new Hono()

app.get('/', (c) => c.json({ items: [] }))
app.get('/unread-count', (c) => c.json({ count: 0 }))
app.post('/mark-read/:id', (c) => c.json({ ok: true }))

export default app
// deno-lint-ignore no-explicit-any
;(globalThis as any).Deno?.serve?.(app.fetch)

