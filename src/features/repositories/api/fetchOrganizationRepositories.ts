import type { GitHubRepository } from '../model/GitHubRepository'

const GITHUB_REPOSITORIES_URL =
  'https://api.github.com/orgs/github/repos?type=public&sort=full_name&direction=asc&per_page=100&page=1'

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
}

export type GitHubRepositoryErrorKind = 'network' | 'http' | 'invalid-response'

export class GitHubRepositoryError extends Error {
  readonly kind: GitHubRepositoryErrorKind
  readonly status?: number
  readonly retryAfterSeconds?: number
  readonly rateLimitResetAt?: Date

  constructor(
    kind: GitHubRepositoryErrorKind,
    message: string,
    details: {
      status?: number
      retryAfterSeconds?: number
      rateLimitResetAt?: Date
    } = {},
  ) {
    super(message)
    this.name = 'GitHubRepositoryError'
    this.kind = kind
    this.status = details.status
    this.retryAfterSeconds = details.retryAfterSeconds
    this.rateLimitResetAt = details.rateLimitResetAt
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined

  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) return seconds

  const date = Date.parse(value)
  if (Number.isNaN(date)) return undefined

  const remainingSeconds = Math.ceil((date - Date.now()) / 1000)
  return Math.max(0, remainingSeconds)
}

function parseRateLimitReset(value: string | null): Date | undefined {
  if (!value) return undefined

  const seconds = Number(value)
  if (!Number.isInteger(seconds) || seconds < 0) return undefined

  return new Date(seconds * 1000)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function normalizeRepository(value: unknown): GitHubRepository {
  if (!isRecord(value)) {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned an invalid repository record.')
  }

  const { id, name, full_name: fullName, html_url: htmlUrl, language, stargazers_count: stars, forks_count: forks } = value
  if (
    !isNonNegativeInteger(id) ||
    typeof name !== 'string' ||
    typeof fullName !== 'string' ||
    typeof htmlUrl !== 'string' ||
    (typeof language !== 'string' && language !== null) ||
    !isNonNegativeInteger(stars) ||
    !isNonNegativeInteger(forks)
  ) {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned a repository with invalid fields.')
  }

  return {
    id,
    name,
    fullName,
    htmlUrl,
    language: language ?? 'Не вказано',
    stars,
    forks,
  }
}

function normalizeResponse(value: unknown): GitHubRepository[] {
  if (!Array.isArray(value)) {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned an invalid repository collection.')
  }

  return value.map(normalizeRepository)
}

export async function fetchOrganizationRepositories(signal: AbortSignal): Promise<GitHubRepository[]> {
  let response: Response
  try {
    response = await fetch(GITHUB_REPOSITORIES_URL, {
      headers: GITHUB_HEADERS,
      signal,
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new GitHubRepositoryError('network', 'The GitHub repository request failed.', { })
  }

  if (!response.ok) {
    throw new GitHubRepositoryError('http', `GitHub returned HTTP ${response.status}.`, {
      status: response.status,
      retryAfterSeconds: parseRetryAfter(response.headers.get('retry-after')),
      rateLimitResetAt: parseRateLimitReset(response.headers.get('x-ratelimit-reset')),
    })
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned malformed JSON.')
  }

  return normalizeResponse(payload)
}
