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
}

export default installDemo

