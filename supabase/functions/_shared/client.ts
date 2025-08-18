// deno-lint-ignore-file
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export function getAdminClient() {
  const url = Deno.env.get('SUPABASE_URL') || 'https://ponclzjxzgoizmfvdzog.supabase.co'
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return createClient(url, serviceKey)
}

export function allowCors(c: any) {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  c.header('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type')
}

export function parseJwtRoles(token: string | undefined): string[] {
  if (!token) return []
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const roles = payload?.app_metadata?.roles
    return Array.isArray(roles) ? roles : []
  } catch {
    return []
  }
}
