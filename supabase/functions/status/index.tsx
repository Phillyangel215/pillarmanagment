import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from '../_shared/kv_store.tsx'

const app = new Hono()

// Create Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

// ===================================================================
// AUTHENTICATION ROUTES - SECURE USER MANAGEMENT
// ===================================================================

// User signup route - Admin only account creation
app.post('/make-server-f2563d1b/auth/signup', async (c) => {
  try {
    const { email, password, firstName, lastName, role, createdByUserId } = await c.req.json()

    // Verify the creating user is an admin
    const creatingUserToken = c.req.header('Authorization')?.split(' ')[1]
    if (!creatingUserToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: creatingUser, error: authError } = await supabase.auth.getUser(creatingUserToken)
    if (authError || !creatingUser.user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    // Get creating user's profile to check role
    const creatingUserProfile = await kv.get(`user_profile:${creatingUser.user.id}`)
    if (!creatingUserProfile || !['ADMIN', 'CEO', 'COO'].includes(creatingUserProfile.role)) {
      return c.json({ error: 'Insufficient permissions to create accounts' }, 403)
    }

    // Validate role
    const validRoles = [
      'ADMIN', 'CEO', 'COO', 'CASE_WORKER', 'SUPERVISOR', 
      'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST'
    ]
    if (!validRoles.includes(role)) {
      return c.json({ error: 'Invalid role specified' }, 400)
    }

    // Create user account
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        first_name: firstName,
        last_name: lastName,
        role,
        created_by: createdByUserId 
      },
      // Automatically confirm email since email server not configured
      email_confirm: true
    })

    if (createError) {
      console.error('User creation failed:', createError)
      return c.json({ error: 'Failed to create user account' }, 500)
    }

    // Store user profile in KV store
    const userProfile = {
      id: newUser.user.id,
      email,
      firstName,
      lastName,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: createdByUserId,
      lastLogin: null,
      permissions: getRolePermissions(role)
    }

    await kv.set(`user_profile:${newUser.user.id}`, userProfile)

    // Audit log
    await kv.set(`audit_log:${Date.now()}`, {
      action: 'USER_CREATE',
      userId: creatingUser.user.id,
      targetUserId: newUser.user.id,
      details: { email, role },
      timestamp: new Date().toISOString(),
      ipAddress: c.req.header('x-forwarded-for') || 'unknown'
    })

    console.log(`New user created: ${email} with role ${role} by ${creatingUser.user.email}`)

    return c.json({ 
      success: true, 
      user: { 
        id: newUser.user.id, 
        email, 
        firstName, 
        lastName, 
        role 
      } 
    })

  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Internal server error during account creation' }, 500)
  }
})

// Get user profile
app.get('/make-server-f2563d1b/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${user.id}`)
    if (!profile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    // Update last login
    profile.lastLogin = new Date().toISOString()
    await kv.set(`user_profile:${user.id}`, profile)

    // Audit log
    await kv.set(`audit_log:${Date.now()}`, {
      action: 'USER_LOGIN',
      userId: user.id,
      timestamp: new Date().toISOString(),
      ipAddress: c.req.header('x-forwarded-for') || 'unknown'
    })

    return c.json({ success: true, user: profile })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return c.json({ error: 'Internal server error fetching profile' }, 500)
  }
})

// List users (Admin only)
app.get('/make-server-f2563d1b/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    // Check if user is admin
    const userProfile = await kv.get(`user_profile:${user.id}`)
    if (!userProfile || !['ADMIN', 'CEO', 'COO'].includes(userProfile.role)) {
      return c.json({ error: 'Insufficient permissions' }, 403)
    }

    // Get all user profiles
    const users = await kv.getByPrefix('user_profile:')
    const userList = users.map(profile => ({
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      status: profile.status,
      createdAt: profile.createdAt,
      lastLogin: profile.lastLogin
    }))

    return c.json({ success: true, users: userList })

  } catch (error) {
    console.error('Users list error:', error)
    return c.json({ error: 'Internal server error fetching users' }, 500)
  }
})

// Create demo admin user for initial setup
app.post('/make-server-f2563d1b/setup/demo-admin', async (c) => {
  try {
    // Check if any admin users already exist
    const existingAdmins = await kv.getByPrefix('user_profile:')
    const adminExists = existingAdmins.some(profile => profile.role === 'ADMIN')
    
    if (adminExists) {
      return c.json({ error: 'Demo admin already exists' }, 400)
    }

    // Create demo admin account
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@nonprofit.local',
      password: 'admin123!',
      user_metadata: { 
        first_name: 'System',
        last_name: 'Administrator',
        role: 'ADMIN',
        created_by: 'system' 
      },
      // Automatically confirm email since email server not configured
      email_confirm: true
    })

    if (createError) {
      console.error('Demo admin creation failed:', createError)
      return c.json({ error: 'Failed to create demo admin account' }, 500)
    }

    // Store user profile in KV store
    const userProfile = {
      id: newUser.user.id,
      email: 'admin@nonprofit.local',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      lastLogin: null,
      permissions: ['all']
    }

    await kv.set(`user_profile:${newUser.user.id}`, userProfile)

    // Audit log
    await kv.set(`audit_log:${Date.now()}`, {
      action: 'DEMO_ADMIN_CREATED',
      userId: 'system',
      targetUserId: newUser.user.id,
      details: { email: 'admin@nonprofit.local', role: 'ADMIN' },
      timestamp: new Date().toISOString(),
      ipAddress: c.req.header('x-forwarded-for') || 'unknown'
    })

    console.log('Demo admin user created: admin@nonprofit.local / admin123!')

    return c.json({ 
      success: true, 
      message: 'Demo admin user created',
      credentials: {
        email: 'admin@nonprofit.local',
        password: 'admin123!',
        note: 'This is a demo account for initial setup only'
      }
    })

  } catch (error) {
    console.error('Demo admin setup error:', error)
    return c.json({ error: 'Internal server error during demo admin setup' }, 500)
  }
})

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

function getRolePermissions(role: string) {
  const permissions = {
    ADMIN: ['all'],
    CEO: ['all'],
    COO: ['users:read', 'clients:all', 'reports:all', 'projects:all'],
    CASE_WORKER: ['clients:read', 'clients:update', 'cases:all'],
    SUPERVISOR: ['clients:read', 'users:read', 'reports:read', 'cases:read'],
    SOCIAL_WORKER: ['clients:read', 'clients:update', 'cases:all'],
    INTAKE_SPECIALIST: ['clients:create', 'clients:read', 'clients:update'],
    HOUSING_SPECIALIST: ['clients:read', 'clients:update', 'housing:all']
  }
  
  return permissions[role as keyof typeof permissions] || []
}

// Health check
app.get('/make-server-f2563d1b/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'nonprofit-management-api'
  })
})

Deno.serve(app.fetch)