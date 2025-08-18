import { API_BASE } from '@/config/appConfig'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function apiJson<T>(
  path: string,
  options: { method?: HttpMethod; headers?: Record<string, string>; body?: unknown } = {},
  timeoutMs: number = 10_000
): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? 'GET',
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Request failed ${res.status}: ${text}`)
    }
    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}
