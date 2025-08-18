export function seedPRNG(seed = 1) {
  let s = seed >>> 0
  return () => ((2 ** 31 - 1) & (s = Math.imul(48271, s))) / 2147483647
}

