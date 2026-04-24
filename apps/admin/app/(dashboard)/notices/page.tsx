'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'

interface Notice {
  id: string
  title: string
  content: string
  type: 'popup' | 'banner' | 'general'
  is_active: boolean
  created_at: string
}

const MOCK_NOTICES: Notice[] = [
  { id: '1', title: '서비스 점검 안내', content: '4월 25일 새벽 2시~4시 점검 예정', type: 'popup', is_active: true, created_at: new Date().toISOString() },
  { id: '2', title: '신규 기능 오픈', content: '꿈 해몽 기능이 추가되었습니다!', type: 'banner', is_active: true, created_at: new Date().toISOString() },
]

const TYPE_LABEL: Record<string, string> = { popup: '팝업', banner: '배너', general: '일반' }
const TYPE_VARIANT: Record<string, 'orange' | 'blue' | 'gray'> = { popup: 'orange', banner: 'blue', general: 'gray' }

const EMPTY_FORM = { title: '', content: '', type: 'general' as const, is_active: true }

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function handleCreate() {
    const newNotice: Notice = {
      id: Date.now().toString(),
      ...form,
      created_at: new Date().toISOString(),
    }
    setNotices([newNotice, ...notices])
    setShowForm(false)
    setForm(EMPTY_FORM)
  }

  function toggleActive(id: string) {
    setNotices(notices.map((n) => (n.id === id ? { ...n, is_active: !n.is_active } : n)))
  }

  function deleteNotice(id: string) {
    setNotices(notices.filter((n) => n.id !== id))
  }

  return (
    <div>
      <PageHeader
        title="공지사항 관리"
        desc="앱 내 팝업·배너·공지를 관리합니다"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + 공지 등록
          </button>
        }
      />

      <div className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-gray-900 border rounded-2xl p-5 transition-colors ${
              notice.is_active ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={TYPE_VARIANT[notice.type]}>{TYPE_LABEL[notice.type]}</Badge>
                  {notice.is_active && <Badge variant="green">노출 중</Badge>}
                </div>
                <h3 className="text-white font-semibold text-sm">{notice.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{notice.content}</p>
                <p className="text-gray-600 text-xs mt-2">
                  {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(notice.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    notice.is_active
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {notice.is_active ? '숨기기' : '노출'}
                </button>
                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-semibold transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-5">공지 등록</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">제목</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">내용</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">유형</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'popup' | 'banner' | 'general' })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm"
                >
                  <option value="general">일반</option>
                  <option value="popup">팝업</option>
                  <option value="banner">배너</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.title}
                className="flex-1 py-3 bg-orange-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
