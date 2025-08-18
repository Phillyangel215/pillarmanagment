// deno-lint-ignore-file
import { Hono } from 'https://deno.land/x/hono@v4.4.7/mod.ts'
import { allowCors } from '../_shared/client.ts'

type Item = { id: string; title: string; message: string; type: 'info'|'success'|'warning'|'error'; isRead: boolean; timestamp: string }

const app = new Hono()

app.use('*', async (c, next) => {
  allowCors(c)
  if (c.req.method === 'OPTIONS') return c.text('ok')
  return next()
})

app.get('/', (c) => {
  // Placeholder: return empty list in prod path; real data comes from DB later
  const items: Item[] = []
  return c.json({ items })
})

app.get('/unread-count', (c) => {
  return c.json({ count: 0 })
})

app.post('/mark-read/:id', (c) => c.json({ ok: true }))

export default app
