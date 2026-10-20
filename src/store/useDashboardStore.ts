import { useStore } from 'zustand'
import type { StoreApi } from 'zustand/vanilla'
import { dashboardStore, type DashboardStore } from './dashboardStore'

export function useDashboardStore<T>(selector: (state: DashboardStore) => T): T {
  return useStore(dashboardStore as StoreApi<DashboardStore>, selector)
}
