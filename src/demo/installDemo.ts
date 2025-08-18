import { installFetchShim, resetDemoState } from './fetchShim'

type DemoScenarioKey = 'happy_path'|'empty_org'|'fire_drill'|'board_meeting'|'audit_mode'
type DemoController = {
  setNet: (net: { latencyMs: number; jitterMs: number }) => void
  setScenario: (key: DemoScenarioKey) => void
}
type DemoWindow = Window & {
  __DEMO__?: DemoController
  __DEMO_RESET__?: () => void
  __DEMO_LATENCY__?: (ms: number, jitter?: number) => void
  __DEMO_SCENARIO__?: (key: DemoScenarioKey) => void
}

export function installDemo() {
  const { reset } = installFetchShim()
  ;(window as DemoWindow).__DEMO_RESET__ = () => {
    resetDemoState()
    reset()
    // Optional: dispatch an event apps can listen to
    window.dispatchEvent(new CustomEvent('demo:reset'))
  }
  // Expose simple helpers in demo mode
  ;(window as DemoWindow).__DEMO_LATENCY__ = (ms: number, jitter = 0) => {
    try { (window as DemoWindow).__DEMO__?.setNet({ latencyMs: ms, jitterMs: jitter }) } catch { /* ignore */ }
  }
  ;(window as DemoWindow).__DEMO_SCENARIO__ = (key: DemoScenarioKey) => {
    try { (window as DemoWindow).__DEMO__?.setScenario(key) } catch { /* ignore */ }
  }
}

export default installDemo

