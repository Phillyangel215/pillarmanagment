import '@testing-library/jest-dom'

// Minimal Web Crypto polyfill for Vitest (jsdom)
// Use Node's crypto if available
import { webcrypto as nodeCrypto } from 'crypto'
if (!(globalThis as any).crypto?.subtle) {
  ;(globalThis as any).crypto = nodeCrypto as unknown as Crypto
}