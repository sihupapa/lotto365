import { z } from 'zod'
import { LOTTO_CONFIG } from './constants'

export const manualSchema = z
  .array(z.number().int().min(LOTTO_CONFIG.MIN).max(LOTTO_CONFIG.MAX))
  .length(LOTTO_CONFIG.PICK)
  .refine((nums) => new Set(nums).size === nums.length, { message: '중복 번호가 있습니다.' })

export function validateManual(numbers: number[]): { ok: boolean; error?: string } {
  const result = manualSchema.safeParse(numbers)
  if (!result.success) {
    return { ok: false, error: result.error.errors[0]?.message }
  }
  return { ok: true }
}
