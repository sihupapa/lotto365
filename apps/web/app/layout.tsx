import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '로또 번호 생성기',
  description: '과학적 분석과 꿈 해몽으로 로또 번호를 추천해드립니다',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
