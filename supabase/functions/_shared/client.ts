import { createClient } from 'npm:@supabase/supabase-js@2'

export function adminClient() {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE')!
  return createClient(url, key, { auth: { persistSession: false } })
}

export function cors(headers: HeadersInit = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    ...headers,
  }
}

export function ok(json: unknown, init: ResponseInit = {}) {
  return new Response(
    JSON.stringify(json),
    { ...init, headers: { 'Content-Type': 'application/json', ...cors(init.headers || {}) } },
  )
}

export function parseJwtRoles(authHeader: string | null): string[] {
  try {
    const token = (authHeader ?? '').replace(/^Bearer\s+/i, '')
    const payload = JSON.parse(atob(token.split('.')[1] || 'e30='))
    // prefer array claim; fallback to single role
    const roles = payload?.roles ?? (payload?.role ? [payload.role] : [])
    return Array.isArray(roles) ? roles : []
  } catch {
    return []
  }
}

