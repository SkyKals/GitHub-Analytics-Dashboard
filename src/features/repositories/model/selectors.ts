import type { Repository } from './Repository'

export function getTotalStars(repositories: readonly Repository[]) {
  return repositories.reduce((total, repository) => total + repository.stars, 0)
}

export function getTotalForks(repositories: readonly Repository[]) {
  return repositories.reduce((total, repository) => total + repository.forks, 0)
}

export function getRepositoryCount(repositories: readonly Repository[]) {
  return repositories.length
}
