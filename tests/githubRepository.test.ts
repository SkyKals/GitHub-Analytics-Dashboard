import assert from 'node:assert/strict'
import test from 'node:test'

import {
  GitHubRepositoryError,
  fetchOrganizationRepositories,
} from '../src/features/repositories/api/fetchOrganizationRepositories.ts'

const validApiRepository = {
  id: 42,
  name: 'analytics',
  full_name: 'github/analytics',
  html_url: 'https://github.com/github/analytics',
  language: null,
  stargazers_count: 12,
  forks_count: 3,
}

test('normalizes GitHub repository fields and accepts an empty page', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input, init) => {
    assert.equal(input, 'https://api.github.com/orgs/github/repos?type=public&sort=full_name&direction=asc&per_page=100&page=1')
    assert.equal(new Headers(init?.headers).get('accept'), 'application/vnd.github+json')
    assert.equal(new Headers(init?.headers).get('x-github-api-version'), '2026-03-10')
    assert(init?.signal instanceof AbortSignal)
    return new Response(JSON.stringify([validApiRepository]), { status: 200 })
  }

  try {
    const repositories = await fetchOrganizationRepositories(new AbortController().signal)

    assert.deepEqual(repositories, [
      {
        id: 42,
        name: 'analytics',
        fullName: 'github/analytics',
        htmlUrl: 'https://github.com/github/analytics',
        language: 'Не вказано',
        stars: 12,
        forks: 3,
      },
    ])

    globalThis.fetch = async () => new Response('[]', { status: 200 })
    assert.deepEqual(await fetchOrganizationRepositories(new AbortController().signal), [])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('reports HTTP failures with status and retry timing', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response('', {
      status: 429,
      headers: { 'retry-after': '30', 'x-ratelimit-reset': '2000000000' },
    })

  try {
    await assert.rejects(
      fetchOrganizationRepositories(new AbortController().signal),
      (error: unknown) => {
        assert(error instanceof GitHubRepositoryError)
        assert.equal(error.kind, 'http')
        assert.equal(error.status, 429)
        assert.equal(error.retryAfterSeconds, 30)
        assert.equal(error.rateLimitResetAt?.getTime(), 2000000000 * 1000)
        return true
      },
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('keeps ordinary HTTP failures separate from rate-limit timing', async () => {
  const originalFetch = globalThis.fetch

  try {
    for (const status of [403, 404, 500]) {
      globalThis.fetch = async () => new Response('', { status })
      await assert.rejects(
        fetchOrganizationRepositories(new AbortController().signal),
        (error: unknown) => {
          assert(error instanceof GitHubRepositoryError)
          assert.equal(error.kind, 'http')
          assert.equal(error.status, status)
          assert.equal(error.retryAfterSeconds, undefined)
          assert.equal(error.rateLimitResetAt, undefined)
          return true
        },
      )
    }
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('reports malformed JSON and malformed repository records', async () => {
  const originalFetch = globalThis.fetch

  try {
    globalThis.fetch = async () => new Response('{', { status: 200 })
    await assert.rejects(
      fetchOrganizationRepositories(new AbortController().signal),
      (error: unknown) => error instanceof GitHubRepositoryError && error.kind === 'invalid-response',
    )

    globalThis.fetch = async () => new Response(JSON.stringify([{ id: 'wrong' }]), { status: 200 })
    await assert.rejects(
      fetchOrganizationRepositories(new AbortController().signal),
      (error: unknown) => error instanceof GitHubRepositoryError && error.kind === 'invalid-response',
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('preserves abort cancellation for the caller', async () => {
  const originalFetch = globalThis.fetch
  const abortError = new DOMException('The operation was aborted', 'AbortError')
  globalThis.fetch = async () => {
    throw abortError
  }

  try {
    await assert.rejects(
      fetchOrganizationRepositories(new AbortController().signal),
      (error: unknown) => error === abortError,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('reports non-abort network failures separately', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => {
    throw new TypeError('offline')
  }

  try {
    await assert.rejects(
      fetchOrganizationRepositories(new AbortController().signal),
      (error: unknown) => error instanceof GitHubRepositoryError && error.kind === 'network',
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
