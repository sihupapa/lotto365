import { LOTTO_CONFIG } from './constants'

export function generateRandom(count = 1): number[][] {
  return Array.from({ length: count }, () => {
    const pool = Array.from({ length: LOTTO_CONFIG.MAX }, (_, i) => i + 1)
    const picked: number[] = []
    for (let i = 0; i < LOTTO_CONFIG.PICK; i++) {
      const idx = Math.floor(Math.random() * (pool.length - i)) + i
      ;[pool[i], pool[idx]] = [pool[idx], pool[i]]
      picked.push(pool[i])
    }
    return picked.sort((a, b) => a - b)
  })
}
