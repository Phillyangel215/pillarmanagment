import { installFetchShim, resetDemoState } from './fetchShim'

export function installDemo() {
  const { reset } = installFetchShim()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__DEMO_RESET__ = () => {
    resetDemoState()
    reset()
    // Optional: dispatch an event apps can listen to
    window.dispatchEvent(new CustomEvent('demo:reset'))
  }
  // Expose simple helpers in demo mode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__DEMO_LATENCY__ = (ms: number, jitter = 0) => {
    try { (window as any).__DEMO__?.setNet({ latencyMs: ms, jitterMs: jitter }) } catch {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__DEMO_SCENARIO__ = (key: 'happy_path'|'empty_org'|'fire_drill'|'board_meeting'|'audit_mode') => {
    try { (window as any).__DEMO__?.setScenario(key) } catch {}
  }
}

export default installDemo

