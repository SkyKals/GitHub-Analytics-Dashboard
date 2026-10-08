import KpiCard from '../../../components/widgets/KpiCard'

type RepositoryKpisProps = {
  totalStars: number
  totalForks: number
  repositoryCount: number
}

export default function RepositoryKpis({
  totalStars,
  totalForks,
  repositoryCount,
}: RepositoryKpisProps) {
  return (
    <section aria-label="Показники репозиторіїв" className="grid gap-6 sm:grid-cols-3">
      <KpiCard title="Усього зірок" value={totalStars} change="+3.2%" />
      <KpiCard title="Усього форків" value={totalForks} change="+1.5%" />
      <KpiCard title="Репозиторії" value={repositoryCount} change="+0.0%" />
    </section>
  )
}
