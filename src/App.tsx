import Counter from './components/Counter'
import DashboardLayout from './components/DashboardLayout'
import KpiCard from './components/KpiCard'
import { repositories } from './data/repositories'

export default function App() {
  const totalStars = repositories.reduce((total, repository) => total + repository.stars, 0)
  const totalForks = repositories.reduce((total, repository) => total + repository.forks, 0)

  return (
    <DashboardLayout>
      <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Аналітика GitHub
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Навчальний дашборд репозиторіїв.
        </p>
      </header>
      <section aria-label="Показники репозиторіїв" className="grid gap-6 sm:grid-cols-3">
        <KpiCard title="Усього зірок" value={totalStars} change="+3.2%" />
        <KpiCard title="Усього форків" value={totalForks} change="+1.5%" />
        <KpiCard title="Репозиторії" value={repositories.length} change="+0.0%" />
      </section>
      <Counter initialValue={0} />
    </DashboardLayout>
  )
}
