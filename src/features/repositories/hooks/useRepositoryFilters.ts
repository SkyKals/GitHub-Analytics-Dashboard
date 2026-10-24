import { useCallback, useMemo } from 'react'
import { useForm, type Control, type FieldErrors } from 'react-hook-form'
import { useDashboardStore } from '../../../store/useDashboardStore'
import { normalizeRepositoryFilters, type RepositoryFilterValues, type RepositoryQueryParams } from '../model/RepositoryQuery'

export type UseRepositoryFiltersResult = {
  control: Control<RepositoryFilterValues>
  errors: FieldErrors<RepositoryFilterValues>
  params: RepositoryQueryParams | null
  resetFilters: () => void
  setFilter: (field: keyof RepositoryFilterValues, value: string) => void
}

function normalizeFilters(filters: RepositoryFilterValues): RepositoryQueryParams | null {
  try {
    return normalizeRepositoryFilters(filters)
  } catch {
    return null
  }
}

export function useRepositoryQueryParams(): RepositoryQueryParams | null {
  const filters = useDashboardStore((state) => state.filters)
  return useMemo(() => normalizeFilters(filters), [filters])
}

export default function useRepositoryFilters(): UseRepositoryFiltersResult {
  const filters = useDashboardStore((state) => state.filters)
  const resetStoreFilters = useDashboardStore((state) => state.resetFilters)
  const setFilter = useDashboardStore((state) => state.setFilter)
  const { control, formState: { errors }, reset } = useForm<RepositoryFilterValues>({
    defaultValues: filters,
    mode: 'onChange',
    shouldUnregister: false,
  })
  const params = useMemo(() => normalizeFilters(filters), [filters])
  const resetFilters = useCallback(() => {
    resetStoreFilters()
    reset({ search: '', language: '', minStars: '' })
  }, [reset, resetStoreFilters])

  return { control, errors, params, resetFilters, setFilter }
}
