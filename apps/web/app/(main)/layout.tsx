import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      <main className="flex-1 pb-24 pt-4 px-4 max-w-lg mx-auto w-full">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
