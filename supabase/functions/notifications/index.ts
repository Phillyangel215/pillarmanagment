import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'

const app = new Hono()
app.use('*', cors())

app.post('/notify', async c => {
  const body = await c.req.json()
  console.log('Notify (stub):', body)
  return c.json({ ok: true })
})

export default app

