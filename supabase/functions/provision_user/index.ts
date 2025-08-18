import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'

const app = new Hono()
app.use('*', cors())

app.post('/provision', async c => {
  // Placeholder; real implementation would call Supabase admin API
  const { email, roles } = await c.req.json()
  console.log('Provision (stub):', email, roles)
  return c.json({ ok: true, id: `stub_${Date.now()}` })
})

export default app

