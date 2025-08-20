import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'

const app = new Hono()
app.use('*', cors())

app.get('/status', c => c.json({ status: 'ok', ts: new Date().toISOString() }))

export default app

