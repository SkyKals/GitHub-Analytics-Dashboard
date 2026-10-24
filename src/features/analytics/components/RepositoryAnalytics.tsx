import type { ReactElement } from 'react'
import type { GitHubRepository } from '../../repositories/model/GitHubRepository'
import { useDashboardStore } from '../../../store/useDashboardStore'
import ChartTypeToggle from './ChartTypeToggle'
import LanguageChart from './LanguageChart'
import { groupRepositoriesByLanguage } from '../model/groupRepositoriesByLanguage'

type RepositoryAnalyticsProps = {
  repositories: readonly GitHubRepository[]
}

export default function RepositoryAnalytics({ repositories }: RepositoryAnalyticsProps): ReactElement {
  const chartType = useDashboardStore((state) => state.chartType)
  const setChartType = useDashboardStore((state) => state.setChartType)
  const data = groupRepositoriesByLanguage(repositories)

  return (
    <section aria-label="Аналітика мов" className="min-w-0 max-w-full overflow-hidden">
      <ChartTypeToggle value={chartType} onChange={setChartType} />
      <div className="mt-4 min-w-0 max-w-full">
        <LanguageChart data={data} type={chartType} />
      </div>
    </section>
  )
}
