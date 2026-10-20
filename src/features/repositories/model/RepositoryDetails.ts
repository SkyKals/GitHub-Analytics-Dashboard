import type { GitHubRepository } from './GitHubRepository'

export interface RepositoryDetails extends GitHubRepository {
  description: string | null
  owner: string
  defaultBranch: string
  license: string | null
  createdAt: string
  updatedAt: string
}

export interface RepositoryIssue {
  id: number
  number: number
  title: string
  htmlUrl: string
  createdAt: string
}

export interface RepositoryContributor {
  id: number
  login: string
  htmlUrl: string
  contributions: number
}
