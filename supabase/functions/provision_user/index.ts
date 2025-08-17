import { serve } from 'https://deno.land/std/http/server.ts'
import { adminClient, ok, parseJwtRoles } from '../_shared/client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return ok({})
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const roles = parseJwtRoles(req.headers.get('Authorization'))
  const isSuper = roles.includes('SUPER_ADMIN')
  if (!isSuper) return new Response('Forbidden', { status: 403 })

  const supabase = adminClient()
  const body = await req.json().catch(() => ({}))
  // EXPECTED: { email, password, roles?: string[] }
  const { email, password, roles: assignRoles = [] } = body

  // 1) Create auth user
  const { data: user, error: e1 } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (e1) return new Response(e1.message, { status: 500 })

  // 2) Set app_metadata.roles (mirror to profile in your backend as needed)
  await supabase.auth.admin.updateUserById(user.user.id, { app_metadata: { roles: assignRoles } })

  // 3) (Optional) Insert into public.profiles
  // await supabase.from('profiles').insert({ user_id: user.user.id, role_array: assignRoles })

  return ok({ ok: true, id: user.user.id })
})

