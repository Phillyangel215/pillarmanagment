const KEY = 'demo.db.v2'
const VER = 2
export type DemoDB<DataType = unknown> = { version: number; data: DataType }

export function loadDB<T = unknown>(fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY) || 'null'
    const j = JSON.parse(raw)
    if (j?.version === VER) return (j as DemoDB<T>).data as T
  } catch {
    // ignore parse/storage errors and fall back
  }
  saveDB(fallback)
  return fallback as T
}

export function saveDB<T = unknown>(data: T) {
  const payload: DemoDB<T> = { version: VER, data }
  localStorage.setItem(KEY, JSON.stringify(payload))
}

export function resetDB() {
  localStorage.removeItem(KEY)
}