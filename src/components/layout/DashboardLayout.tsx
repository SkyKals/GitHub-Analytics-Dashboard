import type { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">{children}</div>
    </main>
  )
}
