import test from 'node:test'
import assert from 'node:assert/strict'
import { createDashboardStore } from '../src/store/dashboardStore.ts'

test('creates independent stores with the approved defaults', () => {
  const first = createDashboardStore()
  const second = createDashboardStore()
  first.getState().setFilter('search', 'react')
  first.getState().toggleTheme()
  first.getState().toggleFavorite(42)

  assert.deepEqual(second.getState().filters, { search: '', language: '', minStars: '' })
  assert.equal(second.getState().theme, 'light')
  assert.deepEqual(second.getState().favoriteIds, [])
  assert.equal(second.getState().chartType, 'bar')
})

test('updates one filter field and resetFilters preserves other state', () => {
  const store = createDashboardStore()
  store.getState().toggleTheme()
  store.getState().toggleFavorite(42)
  store.getState().setChartType('pie')
  store.getState().setFilter('language', 'TypeScript')
  assert.deepEqual(store.getState().filters, { search: '', language: 'TypeScript', minStars: '' })
  store.getState().resetFilters()
  assert.deepEqual(store.getState().filters, { search: '', language: '', minStars: '' })
  assert.equal(store.getState().theme, 'dark')
  assert.deepEqual(store.getState().favoriteIds, [42])
  assert.equal(store.getState().chartType, 'pie')
})

test('toggles theme and favorites using immutable updates', () => {
  const store = createDashboardStore()
  const before = store.getState()
  const beforeFilters = before.filters
  const beforeFavorites = before.favoriteIds
  store.getState().toggleTheme()
  store.getState().toggleTheme()
  store.getState().toggleFavorite(42)
  store.getState().toggleFavorite(7)
  store.getState().toggleFavorite(42)
  assert.equal(store.getState().theme, 'light')
  assert.deepEqual(store.getState().favoriteIds, [7])
  assert.notStrictEqual(store.getState().favoriteIds, beforeFavorites)
  assert.deepEqual(beforeFilters, { search: '', language: '', minStars: '' })
  assert.deepEqual(beforeFavorites, [])
})

test('rejects invalid favorite IDs without changing state', () => {
  const store = createDashboardStore()
  const before = store.getState().favoriteIds
  for (const invalidId of [0, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => store.getState().toggleFavorite(invalidId), TypeError)
  }
  assert.deepEqual(store.getState().favoriteIds, [])
  assert.strictEqual(store.getState().favoriteIds, before)
})

test('sets chart type without changing unrelated state', () => {
  const store = createDashboardStore()
  store.getState().setFilter('minStars', '10')
  store.getState().setChartType('pie')
  assert.equal(store.getState().chartType, 'pie')
  assert.deepEqual(store.getState().filters, { search: '', language: '', minStars: '10' })
})

test('a fresh store returns defaults after another store changes', () => {
  const changed = createDashboardStore()
  changed.getState().setFilter('search', 'changed')
  changed.getState().toggleFavorite(42)
  const fresh = createDashboardStore()
  assert.deepEqual(fresh.getState().filters, { search: '', language: '', minStars: '' })
  assert.deepEqual(fresh.getState().favoriteIds, [])
})
