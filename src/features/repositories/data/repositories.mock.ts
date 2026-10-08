import type { Repository } from '../model/Repository'

export const repositories: readonly Repository[] = [
  { id: 1, name: 'dashboard-core', language: 'TypeScript', stars: 100, forks: 20 },
  { id: 2, name: 'analytics-widgets', language: 'TypeScript', stars: 80, forks: 10 },
  { id: 3, name: 'repo-browser', language: 'JavaScript', stars: 60, forks: 12 },
  { id: 4, name: 'issue-tools', language: 'JavaScript', stars: 40, forks: 8 },
  { id: 5, name: 'language-report', language: 'Python', stars: 30, forks: 6 },
  { id: 6, name: 'commit-summary', language: 'Python', stars: 20, forks: 4 },
]
