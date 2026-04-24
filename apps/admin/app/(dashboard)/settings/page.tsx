'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'

interface PointPolicy {
  earn_ad: number
  earn_login: number
  earn_signup: number
  spend_random: number
  spend_manual: number
  spend_analysis: number
  spend_dream: number
}

const DEFAULT_POLICY: PointPolicy = {
  earn_ad: 10,
  earn_login: 5,
  earn_signup: 50,
  spend_random: 10,
  spend_manual: 5,
  spend_analysis: 20,
  spend_dream: 30,
}

export default function SettingsPage() {
  const [policy, setPolicy] = useState<PointPolicy>(DEFAULT_POLICY)
  const [saved, setSaved] = useState(false)

  function handleChange(key: keyof PointPolicy, value: string) {
    setPolicy({ ...policy, [key]: Number(value) })
    setSaved(false)
  }

  async function handleSave() {
    // TODO: 실제 API 연동
    await new Promise((r) => setTimeout(r, 500))
    setSaved(true)
  }

  const EARN_FIELDS: { key: keyof PointPolicy; label: string; desc: string }[] = [
    { key: 'earn_ad', label: '광고 시청', desc: '광고 1회 시청 시 적립' },
    { key: 'earn_login', label: '출석 체크', desc: '하루 1회 로그인 시 적립' },
    { key: 'earn_signup', label: '회원가입 보너스', desc: '신규 가입 시 1회 지급' },
  ]

  const SPEND_FIELDS: { key: keyof PointPolicy; label: string; desc: string }[] = [
    { key: 'spend_random', label: '🎲 랜덤 생성', desc: '랜덤 번호 1세트 생성' },
    { key: 'spend_manual', label: '✏️ 수동 선택', desc: '수동 번호 1세트 저장' },
    { key: 'spend_analysis', label: '📊 분석 추천', desc: '통계 기반 1세트 추천' },
    { key: 'spend_dream', label: '🌙 꿈 해몽', desc: 'AI 꿈 해몽 1회' },
  ]

  return (
    <div>
      <PageHeader title="시스템 설정" desc="포인트 정책 및 서비스 설정을 관리합니다" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 포인트 적립 정책 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <span className="text-green-400">▲</span> 포인트 적립 설정
          </h2>
          <div className="space-y-4">
            {EARN_FIELDS.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={policy[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    min={0}
                    className="w-20 bg-gray-800 border border-gray-700 text-orange-400 font-mono font-bold rounded-xl px-3 py-2 text-sm text-right"
                  />
                  <span className="text-gray-500 text-sm">P</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 포인트 소모 정책 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <span className="text-red-400">▼</span> 포인트 소모 설정
          </h2>
          <div className="space-y-4">
            {SPEND_FIELDS.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={policy[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    min={0}
                    className="w-20 bg-gray-800 border border-gray-700 text-red-400 font-mono font-bold rounded-xl px-3 py-2 text-sm text-right"
                  />
                  <span className="text-gray-500 text-sm">P</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        {saved && (
          <span className="text-green-400 text-sm">✅ 저장되었습니다.</span>
        )}
        <button
          onClick={handleSave}
          className="ml-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors"
        >
          설정 저장
        </button>
      </div>
    </div>
  )
}
