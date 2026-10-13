import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildRepositorySearchUrl,
  getRepositoryQueryKey,
  normalizeRepositoryQuery,
} from '../src/features/repositories/api/buildRepositorySearchUrl.ts'
import { fetchRepositorySearch } from '../src/features/repositories/api/fetchRepositorySearch.ts'
import { GitHubRepositoryError } from '../src/features/repositories/api/fetchOrganizationRepositories.ts'

test('builds an encoded GitHub search URL constrained to github organization', () => {
  const params = normalizeRepositoryQuery({
    search: 'dashboard',
    language: 'C++',
    minStars: '0',
  })

  assert.deepEqual(params, { search: 'dashboard', language: 'C++', minStars: 0 })

  const url = new URL(buildRepositorySearchUrl(params))
  assert.equal(url.origin, 'https://api.github.com')
  assert.equal(url.pathname, '/search/repositories')
  assert.equal(url.searchParams.get('q'), 'org:github dashboard in:name language:C++ stars:>=0')
  assert.equal(url.searchParams.get('per_page'), '100')
  assert.equal(url.searchParams.get('page'), '1')
})

test('keeps an empty query constrained to the organization and omits absent filters', () => {
  const params = normalizeRepositoryQuery({ search: '', language: '', minStars: '' })

  assert.deepEqual(params, { search: '', language: '', minStars: null })
  assert.equal(new URL(buildRepositorySearchUrl(params)).searchParams.get('q'), 'org:github')
})

test('creates a stable key for equivalent validated search parameters', () => {
  assert.equal(
    getRepositoryQueryKey({ search: 'dashboard', language: 'TypeScript', minStars: 20 }),
    'dashboard\u0000TypeScript\u000020',
  )
})

test('rejects unsupported languages, malformed names, and invalid minimum stars', () => {
  assert.throws(() => normalizeRepositoryQuery({ search: 'repo stars:>10', language: '', minStars: '' }))
  assert.throws(() => normalizeRepositoryQuery({ search: '', language: 'PHP', minStars: '' }))
  assert.throws(() => normalizeRepositoryQuery({ search: '', language: '', minStars: '-1' }))
  assert.throws(() => normalizeRepositoryQuery({ search: '', language: '', minStars: '1.5' }))
})

test('normalizes a GitHub search envelope and preserves incomplete results', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({
    incomplete_results: true,
    items: [{
      id: 42,
      name: 'analytics',
      full_name: 'github/analytics',
      html_url: 'https://github.com/github/analytics',
      language: null,
      stargazers_count: 12,
      forks_count: 3,
    }],
  }), { status: 200 })

  try {
    const result = await fetchRepositorySearch(
      { search: '', language: '', minStars: null },
      new AbortController().signal,
    )

    assert.deepEqual(result, {
      incompleteResults: true,
      items: [{
        id: 42,
        name: 'analytics',
        fullName: 'github/analytics',
        htmlUrl: 'https://github.com/github/analytics',
        language: 'Не вказано',
        stars: 12,
        forks: 3,
      }],
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('preserves HTTP retry timing and abort behavior for repository search', async () => {
  const originalFetch = globalThis.fetch
  const params = { search: '', language: '', minStars: null } as const

  try {
    globalThis.fetch = async () => new Response('', {
      status: 429,
      headers: { 'retry-after': '30', 'x-ratelimit-reset': '2000000000' },
    })
    await assert.rejects(fetchRepositorySearch(params, new AbortController().signal), (error: unknown) => {
      assert(error instanceof GitHubRepositoryError)
      assert.equal(error.kind, 'http')
      assert.equal(error.status, 429)
      assert.equal(error.retryAfterSeconds, 30)
      assert.equal(error.rateLimitResetAt?.getTime(), 2000000000 * 1000)
      return true
    })

    const abortError = new DOMException('The operation was aborted', 'AbortError')
    globalThis.fetch = async () => { throw abortError }
    await assert.rejects(
      fetchRepositorySearch(params, new AbortController().signal),
      (error: unknown) => error === abortError,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
