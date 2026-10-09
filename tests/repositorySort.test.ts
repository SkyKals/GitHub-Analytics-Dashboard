import assert from 'node:assert/strict'
import test from 'node:test'

import type { GitHubRepository } from '../src/features/repositories/model/GitHubRepository.ts'
import { sortRepositories, type RepositorySort } from '../src/features/repositories/model/sortRepositories.ts'

const repositories: GitHubRepository[] = [
  { id: 3, name: 'zeta', fullName: 'github/repo10', htmlUrl: 'https://github.com/github/repo10', language: 'TypeScript', stars: 4, forks: 1 },
  { id: 2, name: 'alpha', fullName: 'github/Repo2', htmlUrl: 'https://github.com/github/repo2', language: 'JavaScript', stars: 4, forks: 2 },
  { id: 1, name: 'beta', fullName: 'github/repo2', htmlUrl: 'https://github.com/github/repo2-other', language: 'Rust', stars: 9, forks: 0 },
]

test('sorts names with numeric, case-insensitive comparison and id tie-break', () => {
  const original = structuredClone(repositories)
  const ascending = sortRepositories(repositories, { field: 'name', direction: 'asc' })
  const descending = sortRepositories(repositories, { field: 'name', direction: 'desc' })

  assert.deepEqual(ascending.map((repository) => repository.id), [1, 2, 3])
  assert.deepEqual(descending.map((repository) => repository.id), [3, 1, 2])
  assert.deepEqual(repositories, original)
  assert.notStrictEqual(ascending, repositories)
})

test('sorts stars in both directions and uses id for equal values', () => {
  const asc: RepositorySort = { field: 'stars', direction: 'asc' }
  const desc: RepositorySort = { field: 'stars', direction: 'desc' }

  assert.deepEqual(sortRepositories(repositories, asc).map((repository) => repository.id), [2, 3, 1])
  assert.deepEqual(sortRepositories(repositories, desc).map((repository) => repository.id), [1, 2, 3])
})

test('sorts empty and single-record collections without mutation', () => {
  const empty: readonly GitHubRepository[] = []
  const single = [repositories[0]] as const

  assert.deepEqual(sortRepositories(empty, { field: 'name', direction: 'asc' }), [])
  assert.deepEqual(sortRepositories(single, { field: 'stars', direction: 'desc' }), [repositories[0]])
})
