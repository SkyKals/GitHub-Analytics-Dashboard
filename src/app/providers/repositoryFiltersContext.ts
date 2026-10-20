import { createContext } from 'react'
import type { UseRepositoryFiltersResult } from '../../features/repositories/hooks/useRepositoryFilters'

export const RepositoryFiltersContext = createContext<UseRepositoryFiltersResult | null>(null)
