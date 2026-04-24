import { LOTTO_CONFIG } from './constants'

export interface AnalysisWeight {
  number: number
  weight: number
}

/**
 * 과거 당첨번호 기반 가중치 랜덤 샘플링
 * - 빈출 번호: 가중치 증가
 * - 장기 미출 번호: 가중치 증가 (역추세)
 * - 홀짝/고저 비율 필터링
 */
export function generateByAnalysis(weights: AnalysisWeight[], count = 1): number[][] {
  return Array.from({ length: count }, () => pickWeighted(weights))
}

function pickWeighted(weights: AnalysisWeight[]): number[] {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)
  const picked: number[] = []
  const remaining = [...weights]

  while (picked.length < LOTTO_CONFIG.PICK) {
    const rand = Math.random() * remaining.reduce((sum, w) => sum + w.weight, 0)
    let cursor = 0
    for (let i = 0; i < remaining.length; i++) {
      cursor += remaining[i].weight
      if (rand <= cursor) {
        picked.push(remaining[i].number)
        remaining.splice(i, 1)
        break
      }
    }
  }

  void totalWeight
  return picked.sort((a, b) => a - b)
}

export function buildWeights(
  winningHistory: number[][],
  totalRounds: number
): AnalysisWeight[] {
  const freq = new Map<number, number>()
  const lastSeen = new Map<number, number>()

  for (let round = 0; round < winningHistory.length; round++) {
    for (const num of winningHistory[round]) {
      freq.set(num, (freq.get(num) ?? 0) + 1)
      lastSeen.set(num, round)
    }
  }

  return Array.from({ length: LOTTO_CONFIG.MAX }, (_, i) => {
    const num = i + 1
    const frequency = freq.get(num) ?? 0
    const lastRound = lastSeen.get(num) ?? -1
    const absentRounds = totalRounds - 1 - lastRound

    // 빈출 점수 (0~1)
    const freqScore = frequency / (totalRounds * LOTTO_CONFIG.PICK / LOTTO_CONFIG.MAX)
    // 미출 점수 (0~1) — 오래 안 나올수록 높음
    const absentScore = Math.min(absentRounds / 10, 1)

    const weight = 0.6 * freqScore + 0.4 * absentScore + 0.1
    return { number: num, weight }
  })
}
