import { StadiumBackground } from '@/components/stadium-background'
import { Sidebar } from '@/components/dashboard/sidebar'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex bg-background">
      <StadiumBackground />
      <Sidebar />
      <main className="relative z-10 flex-1 overflow-auto" role="main">
        {children}
      </main>
    </div>
  )
}
