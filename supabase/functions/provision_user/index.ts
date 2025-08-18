import { Hono } from 'npm:hono'

const app = new Hono()

app.post('/', async (c) => {
  return c.json({ ok: false, error: 'Not enabled in demo' }, 501)
})

export default app
// deno-lint-ignore no-explicit-any
;(globalThis as any).Deno?.serve?.(app.fetch)

