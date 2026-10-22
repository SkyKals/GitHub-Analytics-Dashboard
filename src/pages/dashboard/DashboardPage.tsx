import { useState } from 'react'
import EmptyState from '../../components/feedback/EmptyState'
import ErrorState from '../../components/feedback/ErrorState'
import LoadingState from '../../components/feedback/LoadingState'
import Counter from '../../components/widgets/Counter'
import RepositoryAnalytics from '../../features/analytics/components/RepositoryAnalytics'
import RepositoryFilters from '../../features/repositories/components/filters/RepositoryFilters'
import RepositoryTable from '../../features/repositories/components/table/RepositoryTable'
import { getRepositoryQueryKey } from '../../features/repositories/api/buildRepositorySearchUrl'
import { GitHubRepositoryError } from '../../features/repositories/api/fetchOrganizationRepositories'
import useRepositories from '../../features/repositories/hooks/useRepositories'
import { useRepositoryQueryParams } from '../../features/repositories/hooks/useRepositoryFilters'
import { getRepositoryCount, getTotalForks, getTotalStars } from '../../features/repositories/model/selectors'
import { sortRepositories, type RepositorySort } from '../../features/repositories/model/sortRepositories'
import useDebounce from '../../hooks/useDebounce'
import DashboardHeader from './components/DashboardHeader'
import RepositoryKpis from './components/RepositoryKpis'
import { getRequestState } from './requestState'

function getErrorMessage(error: GitHubRepositoryError): string {
  if (error.kind === 'http') return `Не вдалося завантажити репозиторії (HTTP ${error.status ?? 'невідома помилка'}).`
  if (error.kind === 'invalid-response') return 'Не вдалося обробити відповідь GitHub.'
  return 'Не вдалося завантажити репозиторії через мережеву помилку.'
}

function getRetryAt(error: GitHubRepositoryError): Date | undefined {
  if (error.rateLimitResetAt) return error.rateLimitResetAt
  if (error.retryAfterSeconds === undefined) return undefined
  return new Date(Date.now() + error.retryAfterSeconds * 1000)
}

export default function DashboardPage() {
  const params = useRepositoryQueryParams()
  const queryKey = params === null ? null : getRepositoryQueryKey(params)
  const debouncedQueryKey = useDebounce(queryKey)
  const debouncedParams = params !== null && queryKey === debouncedQueryKey ? params : null
  const { data, loading, error, retry, incompleteResults } = useRepositories(debouncedParams)
  const [sort, setSort] = useState<RepositorySort>({ field: 'name', direction: 'asc' })

  const requestState = getRequestState({ loading, error, repositoryCount: data.length })
  const visibleRepositories = sortRepositories(data, sort)
  const totalStars = getTotalStars(data)
  const totalForks = getTotalForks(data)
  const repositoryCount = getRepositoryCount(data)

  return (
    <>
      <DashboardHeader />
      <p className="text-sm text-slate-600">Організація github · до 100 публічних репозиторіїв · KPI за поточною вибіркою пошуку</p>
      <RepositoryFilters />

      {requestState === 'loading' && <LoadingState />}
      {requestState === 'error' && error && <ErrorState message={getErrorMessage(error)} retryAt={getRetryAt(error)} onRetry={retry} />}
      {(requestState === 'empty' || requestState === 'success') && <RepositoryKpis totalStars={totalStars} totalForks={totalForks} repositoryCount={repositoryCount} />}
      {requestState === 'success' && incompleteResults && <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">GitHub повернув неповну вибірку; показники й графік обчислено за отриманими даними.</p>}
      {(requestState === 'empty' || requestState === 'success') && <RepositoryAnalytics repositories={data} />}
      {requestState === 'empty' && <EmptyState message="За заданими фільтрами репозиторіїв не знайдено." />}
      {requestState === 'success' && (
        <section aria-label="Таблиця репозиторіїв" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Публічні репозиторії</h2>
            <p className="mt-1 text-sm text-slate-600">Сортування не змінює параметри пошуку або показники.</p>
          </div>
          <div className="mt-6">
            <RepositoryTable repositories={visibleRepositories} sort={sort} onSortChange={setSort} />
          </div>
        </section>
      )}

      <Counter initialValue={0} />
    </>
  )
}
