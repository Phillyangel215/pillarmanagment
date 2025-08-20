// Placeholder antivirus function (no-op)
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'

const app = new Hono()
app.use('*', cors())

app.post('/scan', async c => {
  return c.json({ status: 'clean' })
})

export default app

