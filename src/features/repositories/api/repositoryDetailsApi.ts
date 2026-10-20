import type { RepositoryContributor, RepositoryDetails, RepositoryIssue } from '../model/RepositoryDetails'
import {
  createGitHubHttpError,
  GitHubRepositoryError,
} from './fetchOrganizationRepositories.ts'

export { GitHubRepositoryError } from './fetchOrganizationRepositories.ts'

const GITHUB_API_ROOT = 'https://api.github.com/repos'
const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function requestJson(url: string, signal: AbortSignal): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, { headers: GITHUB_HEADERS, signal })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new GitHubRepositoryError('network', 'The GitHub repository request failed.')
  }

  if (!response.ok) throw createGitHubHttpError(response)

  try {
    return await response.json()
  } catch {
    throw new GitHubRepositoryError('invalid-response', 'GitHub returned malformed JSON.')
  }
}

function repositoryUrl(owner: string, repo: string, suffix = ''): string {
  return `${GITHUB_API_ROOT}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}${suffix}`
}

function requireString(value: unknown): value is string {
  return typeof value === 'string'
}

export function normalizeRepositoryDetails(value: unknown): RepositoryDetails {
  if (!isRecord(value)) throw new GitHubRepositoryError('invalid-response', 'GitHub returned an invalid repository record.')
  const owner = isRecord(value.owner) ? value.owner.login : undefined
  const license = isRecord(value.license) ? value.license.name : value.license
  if (
    !isNonNegativeInteger(value.id) || !requireString(value.name) || !requireString(value.full_name) ||
    !requireString(value.html_url) || !requireString(owner) || !requireString(value.default_branch) ||
    !requireString(value.created_at) || !requireString(value.updated_at) ||
    (value.description !== null && !requireString(value.description)) ||
    (license !== null && !requireString(license)) ||
    !isNonNegativeInteger(value.stargazers_count) || !isNonNegativeInteger(value.forks_count) ||
    (value.language !== null && !requireString(value.language))
  ) throw new GitHubRepositoryError('invalid-response', 'GitHub returned a repository with invalid fields.')

  return {
    id: value.id, name: value.name, fullName: value.full_name, htmlUrl: value.html_url,
    language: value.language ?? 'Не вказано', stars: value.stargazers_count, forks: value.forks_count,
    description: value.description, owner, defaultBranch: value.default_branch,
    license: license ?? null, createdAt: value.created_at, updatedAt: value.updated_at,
  }
}

export function normalizeRepositoryIssues(value: unknown): RepositoryIssue[] {
  if (!Array.isArray(value)) throw new GitHubRepositoryError('invalid-response', 'GitHub returned an invalid issues collection.')
  return value.filter((item) => isRecord(item) && !('pull_request' in item)).map((item) => {
    if (!isNonNegativeInteger(item.id) || !isNonNegativeInteger(item.number) || !requireString(item.title) || !requireString(item.html_url) || !requireString(item.created_at)) {
      throw new GitHubRepositoryError('invalid-response', 'GitHub returned an issue with invalid fields.')
    }
    return { id: item.id, number: item.number, title: item.title, htmlUrl: item.html_url, createdAt: item.created_at }
  })
}

export function normalizeRepositoryContributors(value: unknown): RepositoryContributor[] {
  if (!Array.isArray(value)) throw new GitHubRepositoryError('invalid-response', 'GitHub returned an invalid contributors collection.')
  return value.map((item) => {
    if (!isRecord(item) || !isNonNegativeInteger(item.id) || !requireString(item.login) || !requireString(item.html_url) || !isNonNegativeInteger(item.contributions)) {
      throw new GitHubRepositoryError('invalid-response', 'GitHub returned a contributor with invalid fields.')
    }
    return { id: item.id, login: item.login, htmlUrl: item.html_url, contributions: item.contributions }
  })
}

export async function fetchRepositoryDetails(owner: string, repo: string, signal: AbortSignal): Promise<RepositoryDetails> {
  return normalizeRepositoryDetails(await requestJson(repositoryUrl(owner, repo), signal))
}

export async function fetchRepositoryIssues(owner: string, repo: string, signal: AbortSignal): Promise<RepositoryIssue[]> {
  const query = '?state=open&sort=created&direction=desc&per_page=30&page=1'
  return normalizeRepositoryIssues(await requestJson(repositoryUrl(owner, repo, `/issues${query}`), signal))
}

export async function fetchRepositoryContributors(owner: string, repo: string, signal: AbortSignal): Promise<RepositoryContributor[]> {
  return normalizeRepositoryContributors(await requestJson(repositoryUrl(owner, repo, '/contributors?per_page=30&page=1&anon=false'), signal))
}
