import assert from 'node:assert/strict'
import test from 'node:test'

import type { GitHubRepository } from '../src/features/repositories/model/GitHubRepository.ts'
import { groupRepositoriesByLanguage } from '../src/features/analytics/model/groupRepositoriesByLanguage.ts'

function repository(language: string): Pick<GitHubRepository, 'language'> {
  return { language }
}

test('returns no language categories for an empty successful response', () => {
  assert.deepEqual(groupRepositoriesByLanguage([]), [])
})

test('counts repeated primary languages', () => {
  assert.deepEqual(
    groupRepositoriesByLanguage([repository('TypeScript'), repository('Python'), repository('TypeScript')]),
    [
      { language: 'Python', count: 1 },
      { language: 'TypeScript', count: 2 },
    ],
  )
})

test('groups empty and whitespace-only languages under the fallback category', () => {
  assert.deepEqual(
    groupRepositoriesByLanguage([repository(''), repository('  '), repository('Не вказано')]),
    [{ language: 'Не вказано', count: 3 }],
  )
})

test('returns one category when every repository has the same primary language', () => {
  assert.deepEqual(
    groupRepositoriesByLanguage([repository('Rust'), repository('Rust')]),
    [{ language: 'Rust', count: 2 }],
  )
})

test('sorts categories by language name with the Ukrainian locale', () => {
  assert.deepEqual(
    groupRepositoriesByLanguage([repository('B'), repository('A')]),
    [
      { language: 'A', count: 1 },
      { language: 'B', count: 1 },
    ],
  )
})

test('preserves frozen input records while accounting for every repository', () => {
  const repositories = Object.freeze([
    Object.freeze(repository(' TypeScript ')),
    Object.freeze(repository('Go')),
    Object.freeze(repository('')),
  ])

  const result = groupRepositoriesByLanguage(repositories)

  assert.equal(result.reduce((sum, datum) => sum + datum.count, 0), repositories.length)
  assert.deepEqual(repositories, [
    { language: ' TypeScript ' },
    { language: 'Go' },
    { language: '' },
  ])
})
