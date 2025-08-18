export function reportError(e: unknown) {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return
  try {
    navigator.sendBeacon?.('/_err', JSON.stringify({ e: String(e) }))
  } catch {
    // ignore send failures
  }
}

