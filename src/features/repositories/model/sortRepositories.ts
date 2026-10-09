import type { GitHubRepository } from './GitHubRepository'

export type RepositorySortField = 'name' | 'stars'
export type SortDirection = 'asc' | 'desc'

export interface RepositorySort {
  field: RepositorySortField
  direction: SortDirection
}

const nameCollator = new Intl.Collator('en', {
  sensitivity: 'base',
  numeric: true,
})

export function sortRepositories(
  repositories: readonly GitHubRepository[],
  sort: RepositorySort,
): GitHubRepository[] {
  const direction = sort.direction === 'asc' ? 1 : -1

  return [...repositories].sort((left, right) => {
    const comparison = sort.field === 'name'
      ? nameCollator.compare(left.fullName, right.fullName)
      : left.stars - right.stars

    if (comparison !== 0) return comparison * direction
    return left.id - right.id
  })
}
