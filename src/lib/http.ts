type HttpInit = {
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

export async function api<T>(path: string, init: HttpInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(path, {
      method: init.method,
      headers: init.headers,
      // Note: runtime will validate acceptable body types
      ...(init.body !== undefined ? { body: init.body as never } : {}),
      signal: controller.signal,
    } as never)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    return (await response.json()) as T
  } finally {
    clearTimeout(timeoutId)
  }
}