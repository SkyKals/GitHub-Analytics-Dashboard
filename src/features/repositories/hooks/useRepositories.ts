import { useCallback, useEffect, useState } from 'react'
import { fetchRepositorySearch } from '../api/fetchRepositorySearch'
import { GitHubRepositoryError } from '../api/fetchOrganizationRepositories'
import type { GitHubRepository } from '../model/GitHubRepository'
import type { RepositoryQueryParams } from '../model/RepositoryQuery'

type UseRepositoriesResult = {
  data: GitHubRepository[]
  loading: boolean
  error: GitHubRepositoryError | null
  retry: () => void
  incompleteResults: boolean
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function toRepositoryError(error: unknown): GitHubRepositoryError {
  if (error instanceof GitHubRepositoryError) return error
  return new GitHubRepositoryError('network', 'The GitHub repository search request failed.')
}

export default function useRepositories(params: RepositoryQueryParams | null): UseRepositoriesResult {
  const [data, setData] = useState<GitHubRepository[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GitHubRepositoryError | null>(null)
  const [incompleteResults, setIncompleteResults] = useState(false)
  const [retryAttempt, setRetryAttempt] = useState(0)

  const retry = useCallback(() => setRetryAttempt((attempt) => attempt + 1), [])
  const enabled = params !== null
  const search = params?.search
  const language = params?.language
  const minStars = params?.minStars

  useEffect(() => {
    if (!enabled || search === undefined || language === undefined || minStars === undefined) return

    const controller = new AbortController()
    let current = true
    const load = async () => {
      setData([])
      setLoading(true)
      setError(null)
      setIncompleteResults(false)

      try {
        const result = await fetchRepositorySearch({ search, language, minStars }, controller.signal)
        if (!current) return
        setData(result.items)
        setIncompleteResults(result.incompleteResults)
      } catch (requestError) {
        if (current && !isAbortError(requestError)) setError(toRepositoryError(requestError))
      } finally {
        if (current) setLoading(false)
      }
    }

    void load()

    return () => {
      current = false
      controller.abort()
    }
  }, [enabled, language, minStars, retryAttempt, search])

  if (!enabled) return { data: [], loading: false, error: null, retry, incompleteResults: false }
  return { data, loading, error, retry, incompleteResults }
}
