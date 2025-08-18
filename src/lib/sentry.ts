export async function reportError(error: unknown) {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
  if (!dsn) return
  try {
    navigator.sendBeacon?.('/_err', JSON.stringify({ message: String(error), ts: Date.now() }))
  } catch {
    // no-op
  }
}
