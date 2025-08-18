import { serve } from 'https://deno.land/std/http/server.ts'

serve((req) => new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } }))