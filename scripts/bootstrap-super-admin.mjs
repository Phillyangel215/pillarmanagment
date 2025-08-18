#!/usr/bin/env node
// Local-only script to create first SUPER_ADMIN. Do not commit secrets.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const argv = process.argv.slice(2)

function arg(name, def='') {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? (argv[i+1] || '') : def
}

const email = arg('email')
const password = arg('password')
const first = arg('first','Admin')
const last = arg('last','User')
const url = process.env.SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE

if (!email || !password || !url || !service) {
  console.error('Missing required params. Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... node scripts/bootstrap-super-admin.mjs --email you@example.com --password "Temp123!" --first First --last Last')
  process.exit(1)
}

const { createClient } = await import('npm:@supabase/supabase-js@2')
const client = createClient(url, service)

const { data, error } = await client.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { first_name: first, last_name: last },
  app_metadata: { roles: ['SUPER_ADMIN'] }
})

if (error) {
  console.error('Failed to create SUPER_ADMIN:', error)
  process.exit(1)
}

console.log('Created SUPER_ADMIN:', data.user?.id, email)

