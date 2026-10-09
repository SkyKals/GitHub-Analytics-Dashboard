import assert from 'node:assert/strict'
import test from 'node:test'

import type { GitHubRepository } from '../src/features/repositories/model/GitHubRepository.ts'
import { getRepositoryCount, getTotalForks, getTotalStars } from '../src/features/repositories/model/selectors.ts'
import { sortRepositories } from '../src/features/repositories/model/sortRepositories.ts'

const repositories = Object.freeze([
  Object.freeze({ id: 1, name: 'one', fullName: 'github/one', htmlUrl: 'https://github.com/github/one', language: 'TypeScript', stars: 10, forks: 2 }),
  Object.freeze({ id: 2, name: 'two', fullName: 'github/two', htmlUrl: 'https://github.com/github/two', language: 'JavaScript', stars: 15, forks: 3 }),
  Object.freeze({ id: 3, name: 'three', fullName: 'github/three', htmlUrl: 'https://github.com/github/three', language: 'Rust', stars: 5, forks: 1 }),
]) as readonly GitHubRepository[]

test('calculates KPI totals from the full immutable API sample', () => {
  assert.deepEqual(
    [getTotalStars(repositories), getTotalForks(repositories), getRepositoryCount(repositories)],
    [30, 6, 3],
  )

  const filtered = repositories.filter((repository) => repository.language === 'TypeScript')
  const sorted = sortRepositories(repositories, { field: 'stars', direction: 'desc' })
  assert.deepEqual(
    [getTotalStars(repositories), getTotalForks(repositories), getRepositoryCount(repositories)],
    [30, 6, 3],
  )
  assert.deepEqual(filtered.map((repository) => repository.id), [1])
  assert.deepEqual(sorted.map((repository) => repository.id), [2, 1, 3])
})

test('calculates zero KPI values for an empty successful response', () => {
  const empty: readonly GitHubRepository[] = []
  assert.deepEqual([getTotalStars(empty), getTotalForks(empty), getRepositoryCount(empty)], [0, 0, 0])
})
