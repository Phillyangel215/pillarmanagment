import { serve } from 'https://deno.land/std/http/server.ts'
import { adminClient, ok } from '../_shared/client.ts'

function notfound() {
  return new Response('Not found', { status: 404 })
}

function method(m: string) {
  return (r: Request) => r.method === m
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return ok({})
  const url = new URL(req.url)
  const supabase = adminClient()

  // GET /notifications or /notifications?unread=1
  if (url.pathname.endsWith('/notifications') && method('GET')(req)) {
    const unreadOnly = url.searchParams.get('unread') === '1'
    let q = supabase
      .from('notifications')
      .select('id,title,body,read,created_at')
      .order('created_at', { ascending: false })
    if (unreadOnly) q = q.eq('read', false)
    const { data, error } = await q
    if (error) return new Response(error.message, { status: 500 })
    return ok(data ?? [])
  }

  // GET /notifications/unread-count
  if (url.pathname.endsWith('/notifications/unread-count') && method('GET')(req)) {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('read', false)
    if (error) return new Response(error.message, { status: 500 })
    return ok({ count: count ?? 0 })
  }

  // POST /notifications/mark-read/:id
  if (url.pathname.includes('/notifications/mark-read/') && method('POST')(req)) {
    const id = url.pathname.split('/').pop()!
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)
    if (error) return new Response(error.message, { status: 500 })
    return ok({ ok: true })
  }

  return notfound()
})

