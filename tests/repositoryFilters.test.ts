import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeRepositoryFilters } from '../src/features/repositories/model/RepositoryQuery.ts'

test('normalizes empty and valid repository filters for the search API', () => {
  assert.deepEqual(
    normalizeRepositoryFilters({ search: ' dashboard ', language: 'TypeScript', minStars: '0' }),
    { search: 'dashboard', language: 'TypeScript', minStars: 0 },
  )
  assert.deepEqual(
    normalizeRepositoryFilters({ search: '', language: '', minStars: '' }),
    { search: '', language: '', minStars: null },
  )
})

test('rejects filter values that could alter the GitHub search query', () => {
  assert.throws(() => normalizeRepositoryFilters({ search: 'repo stars:>10', language: '', minStars: '' }))
  assert.throws(() => normalizeRepositoryFilters({ search: '', language: 'PHP', minStars: '' }))
  assert.throws(() => normalizeRepositoryFilters({ search: '', language: '', minStars: '-1' }))
  assert.throws(() => normalizeRepositoryFilters({ search: '', language: '', minStars: '1.5' }))
  assert.throws(() => normalizeRepositoryFilters({ search: '', language: '', minStars: '9007199254740992' }))
})
