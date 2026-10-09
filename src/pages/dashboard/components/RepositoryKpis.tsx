import KpiCard from '../../../components/widgets/KpiCard'

type RepositoryKpisProps = {
  totalStars: number
  totalForks: number
  repositoryCount: number
}

export default function RepositoryKpis({ totalStars, totalForks, repositoryCount }: RepositoryKpisProps) {
  return (
    <section aria-label="Показники репозиторіїв" className="grid gap-6 sm:grid-cols-3">
      <KpiCard title="Усього зірок" value={totalStars} />
      <KpiCard title="Усього форків" value={totalForks} />
      <KpiCard title="Репозиторіїв" value={repositoryCount} />
    </section>
  )
}
