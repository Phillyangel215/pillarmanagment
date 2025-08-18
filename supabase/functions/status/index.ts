// deno-lint-ignore-file
import { Hono } from 'https://deno.land/x/hono@v4.4.7/mod.ts'
import { allowCors } from '../_shared/client.ts'

const app = new Hono()

app.use('*', async (c, next) => {
  allowCors(c)
  if (c.req.method === 'OPTIONS') return c.text('ok')
  return next()
})

app.get('/', (c) => c.json({ ok: true, ts: Date.now() }))

export default app
