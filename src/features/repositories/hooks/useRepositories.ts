import { useCallback, useEffect, useState } from 'react'
import { fetchRepositorySearch } from '../api/fetchRepositorySearch'
import { GitHubRepositoryError } from '../api/fetchOrganizationRepositories'
import type { GitHubRepository } from '../model/GitHubRepository'
import type { RepositoryQueryParams } from '../model/RepositoryQuery'
import { getRepositoryQueryKey } from '../api/buildRepositorySearchUrl'

type UseRepositoriesResult = {
  data: GitHubRepository[]
  loading: boolean
  error: GitHubRepositoryError | null
  retry: () => void
  incompleteResults: boolean
  status: 'idle' | 'loading' | 'success' | 'error'
}

type RequestSnapshot = {
  key: string
  status: 'loading' | 'success' | 'error'
  data: GitHubRepository[]
  error: GitHubRepositoryError | null
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
  const [snapshot, setSnapshot] = useState<RequestSnapshot | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)

  const retry = useCallback(() => setRetryAttempt((attempt) => attempt + 1), [])
  const enabled = params !== null
  const search = params?.search
  const language = params?.language
  const minStars = params?.minStars
  const key = params === null ? null : getRepositoryQueryKey(params)

  useEffect(() => {
    if (!enabled || search === undefined || language === undefined || minStars === undefined) return

    const controller = new AbortController()
    let current = true
    const load = async () => {
      if (key !== null) setSnapshot({ key, status: 'loading', data: [], error: null, incompleteResults: false })

      try {
        const result = await fetchRepositorySearch({ search, language, minStars }, controller.signal)
        if (!current) return
        if (key !== null) setSnapshot({ key, status: 'success', data: result.items, error: null, incompleteResults: result.incompleteResults })
      } catch (requestError) {
        if (current && !isAbortError(requestError) && key !== null) {
          setSnapshot({ key, status: 'error', data: [], error: toRepositoryError(requestError), incompleteResults: false })
        }
      }
    }

    void load()

    return () => {
      current = false
      controller.abort()
    }
  }, [enabled, key, language, minStars, retryAttempt, search])

  if (!enabled || key === null) return { data: [], loading: false, error: null, retry, incompleteResults: false, status: 'idle' }
  if (snapshot?.key !== key) return { data: [], loading: true, error: null, retry, incompleteResults: false, status: 'loading' }
  return { ...snapshot, loading: snapshot.status === 'loading', retry }
}
