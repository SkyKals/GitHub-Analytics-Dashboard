import { useContext } from 'react'
import { RepositoryFiltersContext } from './repositoryFiltersContext'

export default function useRepositoryFiltersContext() {
  const value = useContext(RepositoryFiltersContext)
  if (!value) throw new Error('useRepositoryFiltersContext must be used within RepositoryFiltersProvider')
  return value
}
