type KpiCardProps = {
  title: string
  value: number
  change: string
}

export default function KpiCard({ title, value, change }: KpiCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-medium text-slate-600">{title}</h2>
      <p className="mt-3 text-4xl font-semibold tabular-nums text-slate-900">
        {value.toLocaleString('uk-UA')}
      </p>
      <p className="mt-4 text-sm font-medium text-emerald-700">{change}</p>
      <p className="mt-1 text-sm text-slate-500">Демонстраційне значення зміни</p>
    </article>
  )
}
