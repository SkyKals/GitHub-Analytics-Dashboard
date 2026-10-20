import { useCallback, useMemo } from 'react'
import { useForm, useWatch, type Control, type FieldErrors } from 'react-hook-form'
import { normalizeRepositoryFilters, type RepositoryFilterValues, type RepositoryQueryParams } from '../model/RepositoryQuery'

const defaultValues: RepositoryFilterValues = {
  search: '',
  language: '',
  minStars: '',
}

type UseRepositoryFiltersResult = {
  control: Control<RepositoryFilterValues>
  errors: FieldErrors<RepositoryFilterValues>
  params: RepositoryQueryParams | null
  resetFilters: () => void
}

export default function useRepositoryFilters(): UseRepositoryFiltersResult {
  const { control, formState: { errors }, reset } = useForm<RepositoryFilterValues>({
    defaultValues,
    mode: 'onChange',
  })
  const watchedValues = useWatch({ control, defaultValue: defaultValues })
  const search = watchedValues.search ?? ''
  const language = watchedValues.language ?? ''
  const minStars = watchedValues.minStars ?? ''
  const resetFilters = useCallback(() => reset(defaultValues), [reset])
  const params = useMemo(() => {
    try {
      return normalizeRepositoryFilters({ search, language, minStars })
    } catch {
      return null
    }
  }, [language, minStars, search])

  return { control, errors, params, resetFilters }
}
