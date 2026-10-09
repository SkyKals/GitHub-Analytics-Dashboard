import assert from 'node:assert/strict'
import test from 'node:test'

import { getRequestState } from '../src/pages/dashboard/requestState.ts'

test('prioritizes loading, then error, empty, and success states', () => {
  assert.equal(getRequestState({ loading: true, error: null, repositoryCount: 0 }), 'loading')
  assert.equal(getRequestState({ loading: false, error: new Error('failed'), repositoryCount: 4 }), 'error')
  assert.equal(getRequestState({ loading: false, error: null, repositoryCount: 0 }), 'empty')
  assert.equal(getRequestState({ loading: false, error: null, repositoryCount: 4 }), 'success')
})
