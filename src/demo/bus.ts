type Event = { type: string; payload?: any }
const subs = new Set<(e: Event) => void>()
export const bus = {
  emit(e: Event) {
    subs.forEach((fn) => fn(e))
  },
  on(fn: (e: Event) => void) {
    subs.add(fn)
    return () => subs.delete(fn)
  },
}

