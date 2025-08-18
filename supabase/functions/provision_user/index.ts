// deno-lint-ignore-file
import { Hono } from 'https://deno.land/x/hono@v4.4.7/mod.ts'
import { getAdminClient, allowCors, parseJwtRoles } from '../_shared/client.ts'

const app = new Hono()

app.use('*', async (c, next) => {
  allowCors(c)
  if (c.req.method === 'OPTIONS') return c.text('ok')
  return next()
})

app.post('/accounts', async (c) => {
  const auth = c.req.header('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined
  const roles = parseJwtRoles(token)
  if (!roles.includes('SUPER_ADMIN')) {
    return c.json({ error: 'forbidden' }, 403)
  }

  const body = await c.req.json().catch(() => ({})) as { email?: string; password?: string; roles?: string[] }
  if (!body.email || !body.password) {
    return c.json({ error: 'email and password required' }, 400)
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    app_metadata: { roles: body.roles || [] },
  })
  if (error || !data.user) return c.json({ error: error?.message || 'create failed' }, 500)
  return c.json({ id: data.user.id })
})

export default app
