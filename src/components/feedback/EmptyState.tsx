type EmptyStateProps = {
  message?: string
}

export default function EmptyState({ message = 'Публічних репозиторіїв немає' }: EmptyStateProps) {
  return (
    <section role="status" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-medium text-slate-700">{message}</p>
    </section>
  )
}
