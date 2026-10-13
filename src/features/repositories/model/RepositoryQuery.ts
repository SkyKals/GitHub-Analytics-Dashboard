export const repositoryLanguages = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Ruby',
  'Java',
  'C++',
] as const

export type RepositoryLanguage = (typeof repositoryLanguages)[number]

export type RepositoryFilterValues = {
  search: string
  language: string
  minStars: string
}

export type RepositoryQueryParams = {
  search: string
  language: RepositoryLanguage | ''
  minStars: number | null
}

function isRepositoryLanguage(value: string): value is RepositoryLanguage {
  return repositoryLanguages.includes(value as RepositoryLanguage)
}

export function normalizeRepositoryFilters(values: RepositoryFilterValues): RepositoryQueryParams {
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

export type RepositorySearchResult = {
  items: import('./GitHubRepository.ts').GitHubRepository[]
  incompleteResults: boolean
}
