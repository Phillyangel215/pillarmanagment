// Minimal email stub (server-side)
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'

const app = new Hono()
app.use('*', cors())

app.post('/email', async c => {
  const body = await c.req.json()
  console.log('Email send (stub):', body)
  return c.json({ ok: true })
})

export default app

