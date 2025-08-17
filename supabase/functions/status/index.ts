import { serve } from 'https://deno.land/std/http/server.ts'
import { ok } from '../_shared/client.ts'

serve((req) => ok({ ok: true, ts: new Date().toISOString(), svc: 'status' }))

