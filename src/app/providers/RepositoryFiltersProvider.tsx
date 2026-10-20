import type { ReactNode } from 'react'
import useRepositoryFilters from '../../features/repositories/hooks/useRepositoryFilters'
import { RepositoryFiltersContext } from './repositoryFiltersContext'

export default function RepositoryFiltersProvider({ children }: { children: ReactNode }) {
  const value = useRepositoryFilters()
  return <RepositoryFiltersContext.Provider value={value}>{children}</RepositoryFiltersContext.Provider>
}
