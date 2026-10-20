import { createStore, type StoreApi } from 'zustand/vanilla'
import type { RepositoryFilterValues } from '../features/repositories/model/RepositoryQuery'

export type Theme = 'light' | 'dark'
export type ChartType = 'bar' | 'pie'

export type DashboardStore = {
  filters: RepositoryFilterValues
  theme: Theme
  favoriteIds: readonly number[]
  chartType: ChartType
  setFilter: (field: keyof RepositoryFilterValues, value: string) => void
  resetFilters: () => void
  toggleTheme: () => void
  toggleFavorite: (repositoryId: number) => void
  setChartType: (type: ChartType) => void
}

const defaultFilters = (): RepositoryFilterValues => ({ search: '', language: '', minStars: '' })

function isValidRepositoryId(repositoryId: number): boolean {
  return Number.isSafeInteger(repositoryId) && repositoryId > 0
}

export function createDashboardStore(): StoreApi<DashboardStore> {
  return createStore<DashboardStore>((set) => ({
    filters: defaultFilters(),
    theme: 'light',
    favoriteIds: [],
    chartType: 'bar',
    setFilter: (field, value) => set((state) => ({ filters: { ...state.filters, [field]: value } })),
    resetFilters: () => set({ filters: defaultFilters() }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    toggleFavorite: (repositoryId) => {
      if (!isValidRepositoryId(repositoryId)) throw new TypeError('repositoryId must be a positive safe integer')
      set((state) => ({
        favoriteIds: state.favoriteIds.includes(repositoryId)
          ? state.favoriteIds.filter((id) => id !== repositoryId)
          : [...state.favoriteIds, repositoryId],
      }))
    },
    setChartType: (type) => set({ chartType: type }),
  }))
}

export const dashboardStore = createDashboardStore()
