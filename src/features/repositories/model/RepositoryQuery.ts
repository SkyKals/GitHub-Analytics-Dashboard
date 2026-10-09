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

export type RepositorySearchResult = {
  items: import('./GitHubRepository.ts').GitHubRepository[]
  incompleteResults: boolean
}
