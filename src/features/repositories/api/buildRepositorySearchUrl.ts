import { repositoryLanguages, type RepositoryFilterValues, type RepositoryQueryParams } from '../model/RepositoryQuery.ts'

const SEARCH_ENDPOINT = 'https://api.github.com/search/repositories'

function isRepositoryLanguage(value: string): value is (typeof repositoryLanguages)[number] {
  return repositoryLanguages.includes(value as (typeof repositoryLanguages)[number])
}

export function normalizeRepositoryQuery(values: RepositoryFilterValues): RepositoryQueryParams {
  const search = values.search.trim()
  const language = values.language.trim()
  const minStars = values.minStars.trim()

  if (/[:<>]/.test(search)) {
    throw new TypeError('Repository name cannot contain GitHub search qualifiers.')
  }
  if (language !== '' && !isRepositoryLanguage(language)) {
    throw new TypeError('Unsupported repository language.')
  }
  if (minStars !== '' && (!/^\d+$/.test(minStars) || !Number.isSafeInteger(Number(minStars)))) {
    throw new TypeError('Minimum stars must be a non-negative safe integer.')
  }

  return {
    search,
    language,
    minStars: minStars === '' ? null : Number(minStars),
  }
}

export function buildRepositorySearchUrl(params: RepositoryQueryParams): string {
  const terms = ['org:github']
  if (params.search !== '') terms.push(params.search, 'in:name')
  if (params.language !== '') terms.push(`language:${params.language}`)
  if (params.minStars !== null) terms.push(`stars:>=${params.minStars}`)

  const query = new URLSearchParams({ q: terms.join(' '), per_page: '100', page: '1' })
  return `${SEARCH_ENDPOINT}?${query}`
}
