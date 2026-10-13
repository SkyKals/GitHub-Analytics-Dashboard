import { normalizeRepositoryFilters, type RepositoryFilterValues, type RepositoryQueryParams } from '../model/RepositoryQuery.ts'

const SEARCH_ENDPOINT = 'https://api.github.com/search/repositories'

export function normalizeRepositoryQuery(values: RepositoryFilterValues): RepositoryQueryParams {
  return normalizeRepositoryFilters(values)
}

export function buildRepositorySearchUrl(params: RepositoryQueryParams): string {
  const terms = ['org:github']
  if (params.search !== '') terms.push(params.search, 'in:name')
  if (params.language !== '') terms.push(`language:${params.language}`)
  if (params.minStars !== null) terms.push(`stars:>=${params.minStars}`)

  const query = new URLSearchParams({ q: terms.join(' '), per_page: '100', page: '1' })
  return `${SEARCH_ENDPOINT}?${query}`
}

export function getRepositoryQueryKey(params: RepositoryQueryParams): string {
  return `${params.search}\u0000${params.language}\u0000${params.minStars ?? ''}`
}
