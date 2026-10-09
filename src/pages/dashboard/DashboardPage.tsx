import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EmptyState from '../../components/feedback/EmptyState'
import ErrorState from '../../components/feedback/ErrorState'
import LoadingState from '../../components/feedback/LoadingState'
import Counter from '../../components/widgets/Counter'
import Toggle from '../../components/widgets/Toggle'
import RepositoryTable from '../../features/repositories/components/table/RepositoryTable'
import type { GitHubRepository } from '../../features/repositories/model/GitHubRepository'
import { GitHubRepositoryError, fetchOrganizationRepositories } from '../../features/repositories/api/fetchOrganizationRepositories'
import { getRepositoryCount, getTotalForks, getTotalStars } from '../../features/repositories/model/selectors'
import { sortRepositories, type RepositorySort } from '../../features/repositories/model/sortRepositories'
import DashboardHeader from './components/DashboardHeader'
import RepositoryKpis from './components/RepositoryKpis'
import { getRequestState } from './requestState'

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function toRepositoryError(error: unknown): GitHubRepositoryError {
  if (error instanceof GitHubRepositoryError) return error
  return new GitHubRepositoryError('network', 'The GitHub repository request failed.')
}

function getErrorMessage(error: GitHubRepositoryError): string {
  if (error.kind === 'http') {
    return `Не вдалося завантажити репозиторії (HTTP ${error.status ?? 'невідома помилка'}).`
  }
  if (error.kind === 'invalid-response') {
    return 'Не вдалося обробити відповідь GitHub.'
  }
  return 'Не вдалося завантажити репозиторії через мережеву помилку.'
}

function getRetryAt(error: GitHubRepositoryError): Date | undefined {
  if (error.rateLimitResetAt) return error.rateLimitResetAt
  if (error.retryAfterSeconds === undefined) return undefined
  return new Date(Date.now() + error.retryAfterSeconds * 1000)
}

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<GitHubRepositoryError | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [sort, setSort] = useState<RepositorySort>({ field: 'name', direction: 'asc' })
  const [retryAttempt, setRetryAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let current = true

    fetchOrganizationRepositories(controller.signal)
      .then((nextRepositories) => {
        if (current) setRepositories(nextRepositories)
      })
      .catch((requestError: unknown) => {
        if (current && !isAbortError(requestError)) setError(toRepositoryError(requestError))
      })
      .finally(() => {
        if (current) setLoading(false)
      })

    return () => {
      current = false
      controller.abort()
    }
  }, [retryAttempt])

  const languages = [...new Set(repositories.map((repository) => repository.language))].sort((left, right) => left.localeCompare(right, 'uk'))
  const effectiveLanguage = selectedLanguage !== '' && languages.includes(selectedLanguage) ? selectedLanguage : ''
  const filteredRepositories = effectiveLanguage === ''
    ? repositories
    : repositories.filter((repository) => repository.language === effectiveLanguage)
  const visibleRepositories = sortRepositories(filteredRepositories, sort)
  const requestState = getRequestState({ loading, error, repositoryCount: repositories.length })
  const totalStars = getTotalStars(repositories)
  const totalForks = getTotalForks(repositories)
  const repositoryCount = getRepositoryCount(repositories)
  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRetryAttempt((attempt) => attempt + 1)
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      <p className="text-sm text-slate-600">Організація github · до 100 публічних репозиторіїв · KPI за завантаженою вибіркою</p>

      {requestState === 'loading' && <LoadingState />}
      {requestState === 'error' && error && (
        <ErrorState message={getErrorMessage(error)} retryAt={getRetryAt(error)} onRetry={handleRetry} />
      )}
      {(requestState === 'empty' || requestState === 'success') && (
        <RepositoryKpis totalStars={totalStars} totalForks={totalForks} repositoryCount={repositoryCount} />
      )}
      {requestState === 'empty' && <EmptyState />}
      {requestState === 'success' && (
        <section aria-label="Таблиця репозиторіїв" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Публічні репозиторії</h2>
              <p className="mt-1 text-sm text-slate-600">Фільтр і сортування застосовуються до завантаженої вибірки.</p>
            </div>
            <label className="font-medium text-slate-900">
              Мова програмування
              <select
                value={effectiveLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 sm:w-auto"
              >
                <option value="">Усі</option>
                {languages.map((language) => <option key={language} value={language}>{language}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-6">
            <RepositoryTable repositories={visibleRepositories} sort={sort} onSortChange={setSort} />
          </div>
        </section>
      )}

      <Counter initialValue={0} />
      <Toggle />
    </DashboardLayout>
  )
}
