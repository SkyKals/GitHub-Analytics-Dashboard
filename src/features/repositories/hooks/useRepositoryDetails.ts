import { useCallback, useEffect, useState } from 'react'
import { fetchRepositoryContributors } from '../api/fetchRepositoryContributors'
import { fetchRepositoryDetails } from '../api/fetchRepositoryDetails'
import { fetchRepositoryIssues } from '../api/fetchRepositoryIssues'
import { GitHubRepositoryError } from '../api/repositoryDetailsApi'
import type { RepositoryContributor, RepositoryDetails, RepositoryIssue } from '../model/RepositoryDetails'

type Resource<T> = { data: T | null; loading: boolean; error: GitHubRepositoryError | null }
export type RepositoryDetailsResult = {
  repository: Resource<RepositoryDetails>
  issues: Resource<RepositoryIssue[]>
  contributors: Resource<RepositoryContributor[]>
  retry: () => void
}

const emptyResource = <T,>(): Resource<T> => ({ data: null, loading: false, error: null })
function isAbortError(error: unknown): boolean { return error instanceof DOMException && error.name === 'AbortError' }
function toError(error: unknown): GitHubRepositoryError {
  return error instanceof GitHubRepositoryError ? error : new GitHubRepositoryError('network', 'Мережева помилка GitHub.')
}

export default function useRepositoryDetails(owner: string, repo: string): RepositoryDetailsResult {
  const [repository, setRepository] = useState<Resource<RepositoryDetails>>(emptyResource)
  const [issues, setIssues] = useState<Resource<RepositoryIssue[]>>(emptyResource)
  const [contributors, setContributors] = useState<Resource<RepositoryContributor[]>>(emptyResource)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const retry = useCallback(() => setRetryAttempt((attempt) => attempt + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let current = true
    queueMicrotask(() => {
      if (!current) return
      setRepository({ data: null, loading: true, error: null })
      setIssues(emptyResource())
      setContributors(emptyResource())
    })

    void fetchRepositoryDetails(owner, repo, controller.signal).then((data) => {
      if (!current) return
      setRepository({ data, loading: false, error: null })
      setIssues({ data: null, loading: true, error: null })
      setContributors({ data: null, loading: true, error: null })
      void Promise.allSettled([
        fetchRepositoryIssues(owner, repo, controller.signal),
        fetchRepositoryContributors(owner, repo, controller.signal),
      ]).then(([issueResult, contributorResult]) => {
        if (!current) return
        setIssues(issueResult.status === 'fulfilled' ? { data: issueResult.value, loading: false, error: null } : { data: null, loading: false, error: toError(issueResult.reason) })
        setContributors(contributorResult.status === 'fulfilled' ? { data: contributorResult.value, loading: false, error: null } : { data: null, loading: false, error: toError(contributorResult.reason) })
      })
    }).catch((error: unknown) => {
      if (current && !isAbortError(error)) setRepository({ data: null, loading: false, error: toError(error) })
    })

    return () => { current = false; controller.abort() }
  }, [owner, repo, retryAttempt])

  return { repository, issues, contributors, retry }
}
