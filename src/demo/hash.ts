export function canonical(o: unknown): string {
  const seen = new WeakSet()
  const clean = (x: unknown): unknown => {
    if (x && typeof x === 'object') {
      if (seen.has(x)) return null
      seen.add(x)
      if (Array.isArray(x)) return (x as unknown[]).map(clean)
      const out: Record<string, unknown> = {}
      Object.keys(x)
        .sort()
        .forEach((k) => {
          if (k === 'hash' || k === 'prev_hash') return
          out[k] = clean((x as Record<string, unknown>)[k])
        })
      return out
    }
    return x
  }
  return JSON.stringify(clean(o))
}

export async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

