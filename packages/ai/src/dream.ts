import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const dreamResultSchema = z.object({
  keywords: z.array(z.string()).max(5),
  numbers: z.array(z.number().int().min(1).max(45)).length(6),
  reasoning: z.string(),
})

export type DreamResult = z.infer<typeof dreamResultSchema>

export async function interpretDream(dreamText: string): Promise<DreamResult> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `당신은 한국 전통 꿈 해몽 전문가이자 로또 번호 추천가입니다.
사용자의 꿈 내용을 분석하여 로또 번호 6개를 추천해주세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "keywords": ["키워드1", "키워드2", ...],  // 꿈에서 추출한 핵심 키워드 (최대 5개)
  "numbers": [n1, n2, n3, n4, n5, n6],     // 1~45 사이 중복없는 6개 숫자 (오름차순)
  "reasoning": "번호 추천 이유 설명"         // 꿈과 번호의 연관성 설명
}`,
    messages: [{ role: 'user', content: dreamText }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI 응답 파싱 실패')

  const parsed = JSON.parse(jsonMatch[0])
  return dreamResultSchema.parse(parsed)
}
