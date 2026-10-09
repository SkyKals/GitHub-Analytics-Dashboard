import type { Repository } from './Repository'

export interface GitHubRepository extends Repository {
  fullName: string
  htmlUrl: string
}
