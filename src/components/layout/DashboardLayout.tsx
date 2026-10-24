import type { ReactNode } from 'react'
import ThemeToggle from '../../features/theme/components/ThemeToggle'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6"><div className="flex min-w-0 justify-end"><ThemeToggle /></div>{children}</div>
    </main>
  )
}
