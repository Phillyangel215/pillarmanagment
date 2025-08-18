import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from '../_shared/kv_store.ts'

const app = new Hono()

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
app.use('*', logger(console.log))

app.post('/auth/signup', async (c) => {
  try {
    const { email, password, firstName, lastName, role, createdByUserId } = await c.req.json()
    const creatingUserToken = c.req.header('Authorization')?.split(' ')[1]
    if (!creatingUserToken) return c.json({ error: 'Authorization required' }, 401)
    const { data: creatingUser, error: authError } = await supabase.auth.getUser(creatingUserToken)
    if (authError || !creatingUser.user) return c.json({ error: 'Invalid authorization' }, 401)
    const creatingUserProfile: any = await kv.get(`user_profile:${creatingUser.user.id}`)
    if (!creatingUserProfile || !['ADMIN', 'CEO', 'COO'].includes(creatingUserProfile.role)) {
      return c.json({ error: 'Insufficient permissions to create accounts' }, 403)
    }
    const validRoles = ['ADMIN','CEO','COO','CASE_WORKER','SUPERVISOR','SOCIAL_WORKER','INTAKE_SPECIALIST','HOUSING_SPECIALIST']
    if (!validRoles.includes(role)) return c.json({ error: 'Invalid role specified' }, 400)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name: firstName, last_name: lastName, role, created_by: createdByUserId },
      email_confirm: true,
    })
    if (createError) return c.json({ error: 'Failed to create user account' }, 500)
    const userProfile = { id: newUser.user.id, email, firstName, lastName, role, status: 'active', createdAt: new Date().toISOString(), createdBy: createdByUserId, lastLogin: null, permissions: getRolePermissions(role) }
    await kv.set(`user_profile:${newUser.user.id}`, userProfile)
    await kv.set(`audit_log:${Date.now()}`, { action: 'USER_CREATE', userId: creatingUser.user.id, targetUserId: newUser.user.id, details: { email, role }, timestamp: new Date().toISOString(), ipAddress: c.req.header('x-forwarded-for') || 'unknown' })
    return c.json({ success: true, user: { id: newUser.user.id, email, firstName, lastName, role } })
  } catch (error) {
    return c.json({ error: 'Internal server error during account creation' }, 500)
  }
})

app.get('/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401)
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) return c.json({ error: 'Invalid authorization' }, 401)
    const profile: any = await kv.get(`user_profile:${user.id}`)
    if (!profile) return c.json({ error: 'User profile not found' }, 404)
    profile.lastLogin = new Date().toISOString()
    await kv.set(`user_profile:${user.id}`, profile)
    await kv.set(`audit_log:${Date.now()}`, { action: 'USER_LOGIN', userId: user.id, timestamp: new Date().toISOString(), ipAddress: c.req.header('x-forwarded-for') || 'unknown' })
    return c.json({ success: true, user: profile })
  } catch (error) {
    return c.json({ error: 'Internal server error fetching profile' }, 500)
  }
})

app.get('/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401)
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) return c.json({ error: 'Invalid authorization' }, 401)
    const userProfile: any = await kv.get(`user_profile:${user.id}`)
    if (!userProfile || !['ADMIN', 'CEO', 'COO'].includes(userProfile.role)) return c.json({ error: 'Insufficient permissions' }, 403)
    const users = await kv.getByPrefix('user_profile:')
    const userList = (users as any[]).map((p: any) => ({ id: p.id, email: p.email, firstName: p.firstName, lastName: p.lastName, role: p.role, status: p.status, createdAt: p.createdAt, lastLogin: p.lastLogin }))
    return c.json({ success: true, users: userList })
  } catch (error) {
    return c.json({ error: 'Internal server error fetching users' }, 500)
  }
})

app.post('/setup/demo-admin', async (c) => {
  try {
    const existingAdmins: any[] = await kv.getByPrefix('user_profile:')
    const adminExists = existingAdmins.some((p: any) => p.role === 'ADMIN')
    if (adminExists) return c.json({ error: 'Demo admin already exists' }, 400)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@nonprofit.local',
      password: 'admin123!',
      user_metadata: { first_name: 'System', last_name: 'Administrator', role: 'ADMIN', created_by: 'system' },
      email_confirm: true,
    })
    if (createError) return c.json({ error: 'Failed to create demo admin account' }, 500)
    const userProfile = { id: newUser.user.id, email: 'admin@nonprofit.local', firstName: 'System', lastName: 'Administrator', role: 'ADMIN', status: 'active', createdAt: new Date().toISOString(), createdBy: 'system', lastLogin: null, permissions: ['all'] }
    await kv.set(`user_profile:${newUser.user.id}`, userProfile)
    await kv.set(`audit_log:${Date.now()}`, { action: 'DEMO_ADMIN_CREATED', userId: 'system', targetUserId: newUser.user.id, details: { email: 'admin@nonprofit.local', role: 'ADMIN' }, timestamp: new Date().toISOString(), ipAddress: c.req.header('x-forwarded-for') || 'unknown' })
    return c.json({ success: true, message: 'Demo admin user created', credentials: { email: 'admin@nonprofit.local', password: 'admin123!', note: 'This is a demo account for initial setup only' } })
  } catch (error) {
    return c.json({ error: 'Internal server error during demo admin setup' }, 500)
  }
})

app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'nonprofit-management-api' }))

function getRolePermissions(role: string) {
  const permissions: Record<string, string[]> = {
    ADMIN: ['all'],
    CEO: ['all'],
    COO: ['users:read', 'clients:all', 'reports:all', 'projects:all'],
    CASE_WORKER: ['clients:read', 'clients:update', 'cases:all'],
    SUPERVISOR: ['clients:read', 'users:read', 'reports:read', 'cases:read'],
    SOCIAL_WORKER: ['clients:read', 'clients:update', 'cases:all'],
    INTAKE_SPECIALIST: ['clients:create', 'clients:read', 'clients:update'],
    HOUSING_SPECIALIST: ['clients:read', 'clients:update', 'housing:all'],
  }
  return permissions[role] || []
}

export default app
// deno-lint-ignore no-explicit-any
;(globalThis as any).Deno?.serve?.(app.fetch)

