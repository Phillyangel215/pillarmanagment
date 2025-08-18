type SendArgs = { to: string; subject: string; html: string }

export async function sendEmail({ to, subject, html }: SendArgs) {
  if (import.meta.env.VITE_DEMO === '1') {
    console.info('[DEMO EMAIL]', { to, subject })
    return { ok: true }
  }
  const useFn = Boolean(import.meta.env.VITE_USE_EMAIL_FN)
  if (useFn) {
    const res = await fetch('/functions/v1/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, subject, html }) })
    if (!res.ok) throw new Error('Email send failed')
    return await res.json()
  }
  console.warn('No email provider configured; skipping send')
  return { ok: false }
}

