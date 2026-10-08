import { GitBranch } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-slate-900 text-white" aria-hidden="true">
          <GitBranch size={24} />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Аналітика GitHub
        </h1>
      </div>
      <p className="mt-3 text-base leading-7 text-slate-600">
        Навчальний дашборд репозиторіїв.
      </p>
    </header>
  )
}
