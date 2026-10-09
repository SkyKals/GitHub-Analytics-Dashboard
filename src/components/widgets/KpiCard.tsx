import { BookOpen, GitFork, Star } from 'lucide-react'

type KpiCardProps = {
  title: string
  value: number
  change?: string
}

export default function KpiCard({ title, value, change }: KpiCardProps) {
  const Icon = title === 'Усього зірок' ? Star : title === 'Усього форків' ? GitFork : BookOpen

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-medium text-slate-600">{title}</h2>
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700" aria-hidden="true">
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-3 text-4xl font-semibold tabular-nums text-slate-900">
        {value.toLocaleString('uk-UA')}
      </p>
      {change && (
        <>
          <p className="mt-4 text-sm font-medium text-emerald-700">{change}</p>
          <p className="mt-1 text-sm text-slate-500">Демонстраційне значення зміни</p>
        </>
      )}
    </article>
  )
}
