import assert from 'node:assert/strict'
import test from 'node:test'

import {
  fetchRepositoryContributors,
  fetchRepositoryDetails,
  fetchRepositoryIssues,
  GitHubRepositoryError,
} from '../src/features/repositories/api/repositoryDetailsApi.ts'

const originalFetch = globalThis.fetch

test.afterEach(() => { globalThis.fetch = originalFetch })

test('fetches and normalizes repository details with nullable fields', async () => {
  globalThis.fetch = async (input) => {
    assert.equal(input, 'https://api.github.com/repos/github/analytics')
    return new Response(JSON.stringify({
      id: 1, name: 'analytics', full_name: 'github/analytics', html_url: 'https://github.com/github/analytics',
      owner: { login: 'github' }, description: null, default_branch: 'main', license: null,
      created_at: '2020-01-01T00:00:00Z', updated_at: '2020-01-02T00:00:00Z', language: null,
      stargazers_count: 4, forks_count: 2,
    }), { status: 200 })
  }
  assert.deepEqual(await fetchRepositoryDetails('github', 'analytics', new AbortController().signal), {
    id: 1, name: 'analytics', fullName: 'github/analytics', htmlUrl: 'https://github.com/github/analytics',
    language: 'Не вказано', stars: 4, forks: 2, description: null, owner: 'github', defaultBranch: 'main',
    license: null, createdAt: '2020-01-01T00:00:00Z', updatedAt: '2020-01-02T00:00:00Z',
  })
})

test('filters pull requests from issues and encodes URL segments', async () => {
  globalThis.fetch = async (input) => {
    assert.equal(input, 'https://api.github.com/repos/a%2Fb/name%20with%20space/issues?state=open&sort=created&direction=desc&per_page=30&page=1')
    return new Response(JSON.stringify([
      { id: 2, number: 8, title: 'Issue', html_url: 'https://github.com/i', created_at: '2020-01-01' },
      { id: 3, number: 9, title: 'PR', html_url: 'https://github.com/p', created_at: '2020-01-02', pull_request: {} },
    ]), { status: 200 })
  }
  assert.deepEqual(await fetchRepositoryIssues('a/b', 'name with space', new AbortController().signal), [
    { id: 2, number: 8, title: 'Issue', htmlUrl: 'https://github.com/i', createdAt: '2020-01-01' },
  ])
})

test('normalizes contributors and preserves abort and HTTP errors', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify([{ id: 7, login: 'octo', html_url: 'https://github.com/octo', contributions: 11 }]), { status: 200 })
  assert.deepEqual(await fetchRepositoryContributors('github', 'analytics', new AbortController().signal), [
    { id: 7, login: 'octo', htmlUrl: 'https://github.com/octo', contributions: 11 },
  ])

  const abortError = new DOMException('aborted', 'AbortError')
  globalThis.fetch = async () => { throw abortError }
  await assert.rejects(fetchRepositoryDetails('github', 'analytics', new AbortController().signal), (error) => error === abortError)

  globalThis.fetch = async () => new Response('', { status: 404 })
  await assert.rejects(fetchRepositoryDetails('github', 'analytics', new AbortController().signal), (error) => error instanceof GitHubRepositoryError && error.status === 404)
})
