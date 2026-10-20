import type { RepositoryQueryParams, RepositorySearchResult } from '../model/RepositoryQuery.ts'
import { buildRepositorySearchUrl } from './buildRepositorySearchUrl.ts'
import {
  createGitHubHttpError,
  GitHubRepositoryError,
  normalizeGitHubRepositoryCollection,
} from './fetchOrganizationRepositories.ts'

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function isSearchEnvelope(value: unknown): value is { items: unknown; incomplete_results?: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'items' in value
}

export async function fetchRepositorySearch(
  params: RepositoryQueryParams,
  signal: AbortSignal,
): Promise<RepositorySearchResult> {
  let response: Response
  try {
    response = await fetch(buildRepositorySearchUrl(params), { headers: GITHUB_HEADERS, signal })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new GitHubRepositoryError('network', 'The GitHub repository search request failed.')
  }

  if (!response.ok) throw createGitHubHttpError(response)

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned malformed JSON.')
  }

  if (!isSearchEnvelope(payload) || (payload.incomplete_results !== undefined && typeof payload.incomplete_results !== 'boolean')) {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned an invalid repository search response.')
  }

  return {
    items: normalizeGitHubRepositoryCollection(payload.items),
    incompleteResults: payload.incomplete_results === true,
  }
}
