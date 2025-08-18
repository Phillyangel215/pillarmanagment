const KEY = 'demo.db.v2'
const VER = 2
export type DemoDB = { version: number; data: any }

export function loadDB<T = any>(fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY) || 'null'
    const j = JSON.parse(raw)
    if (j?.version === VER) return j.data as T
  } catch {}
  saveDB(fallback)
  return fallback as T
}

export function saveDB<T = any>(data: T) {
  localStorage.setItem(KEY, JSON.stringify({ version: VER, data }))
}

export function resetDB() {
  localStorage.removeItem(KEY)
}

