export default function validateEnv() {
  const isProd = Boolean(import.meta.env.PROD)
  const isDemo = import.meta.env.VITE_DEMO === '1'
  if (isProd && !isDemo) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
    const missing = [
      !url ? 'VITE_SUPABASE_URL' : null,
      !anon ? 'VITE_SUPABASE_ANON_KEY' : null,
    ].filter(Boolean) as string[]
    if (missing.length) {
      throw new Error(`Missing required env vars: ${missing.join(', ')}`)
    }
  }
  // Sentry DSN is optional; if present, reporting can initialize elsewhere
}
