import assert from 'node:assert/strict'
import test from 'node:test'

import { getRequestState } from '../src/pages/dashboard/requestState.ts'
import { getDashboardRequestState } from '../src/pages/dashboard/requestState.ts'

test('prioritizes loading, then error, empty, and success states', () => {
  assert.equal(getRequestState({ loading: true, error: null, repositoryCount: 0 }), 'loading')
  assert.equal(getRequestState({ loading: false, error: new Error('failed'), repositoryCount: 4 }), 'error')
  assert.equal(getRequestState({ loading: false, error: null, repositoryCount: 0 }), 'empty')
  assert.equal(getRequestState({ loading: false, error: null, repositoryCount: 4 }), 'success')
})

test('does not show empty results before the current query succeeds', () => {
  assert.equal(getDashboardRequestState({ valid: false, debouncing: false, status: 'idle', count: 0 }), 'invalid')
  assert.equal(getDashboardRequestState({ valid: true, debouncing: true, status: 'success', count: 0 }), 'debouncing')
  assert.equal(getDashboardRequestState({ valid: true, debouncing: false, status: 'loading', count: 0 }), 'loading')
  assert.equal(getDashboardRequestState({ valid: true, debouncing: false, status: 'success', count: 0 }), 'empty')
})
