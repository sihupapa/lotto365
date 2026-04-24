'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'

interface Event {
  id: string
  title: string
  description: string | null
  type: string
  reward_point: number
  start_at: string
  end_at: string
  is_active: boolean
  created_at: string
}

const TYPE_LABEL: Record<string, string> = {
  point_reward: '포인트 지급',
  draw_bonus: '추첨 보너스',
  ad_free: '광고 제거',
}

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'point_reward',
  reward_point: 100,
  start_at: '',
  end_at: '',
  is_active: true,
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchEvents() {
    setLoading(true)
    const res = await fetch('/api/v1/admin/events')
    const json = await res.json()
    setEvents(json.data?.events ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  async function handleCreate() {
    if (!form.title || !form.start_at || !form.end_at) {
      setError('제목, 시작일, 종료일을 모두 입력하세요.')
      return
    }
    setSaving(true)
    setError(null)
    const res = await fetch('/api/v1/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        start_at: new Date(form.start_at).toISOString(),
        end_at: new Date(form.end_at).toISOString(),
      }),
    })
    const json = await res.json()
    setSaving(false)
    if (!json.success) { setError(json.message ?? '생성 실패'); return }
    setShowForm(false)
    setForm(EMPTY_FORM)
    await fetchEvents()
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/v1/admin/events?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    })
    await fetchEvents()
  }

  const now = new Date()

  return (
    <div>
      <PageHeader
        title="이벤트 관리"
        desc="사용자 이벤트를 등록하고 관리합니다"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + 이벤트 등록
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500">등록된 이벤트가 없습니다</div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => {
            const started = new Date(ev.start_at) <= now
            const ended = new Date(ev.end_at) < now
            const status = ended ? 'gray' : started ? 'green' : 'blue'
            const statusLabel = ended ? '종료' : started ? '진행 중' : '예정'

            return (
              <div
                key={ev.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={status}>{statusLabel}</Badge>
                    <Badge variant="gray">{TYPE_LABEL[ev.type]}</Badge>
                  </div>
                  <h3 className="text-white font-semibold text-sm mt-1.5">{ev.title}</h3>
                  {ev.description && (
                    <p className="text-gray-400 text-xs mt-1">{ev.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>🪙 +{ev.reward_point}P</span>
                    <span>📅 {new Date(ev.start_at).toLocaleDateString('ko-KR')} ~ {new Date(ev.end_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(ev.id, ev.is_active)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    ev.is_active
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {ev.is_active ? '비활성화' : '활성화'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* 이벤트 등록 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-5">이벤트 등록</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">이벤트 제목 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="이벤트 제목"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="이벤트 설명"
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">유형</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm"
                  >
                    <option value="point_reward">포인트 지급</option>
                    <option value="draw_bonus">추첨 보너스</option>
                    <option value="ad_free">광고 제거</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">지급 포인트</label>
                  <input
                    type="number"
                    value={form.reward_point}
                    onChange={(e) => setForm({ ...form, reward_point: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">시작일 *</label>
                  <input
                    type="datetime-local"
                    value={form.start_at}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">종료일 *</label>
                  <input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowForm(false); setError(null) }}
                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm"
              >
                {saving ? '저장 중...' : '등록하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
