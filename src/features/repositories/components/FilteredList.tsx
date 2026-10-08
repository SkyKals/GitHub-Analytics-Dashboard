import { useId, useState } from 'react'
import type { Repository } from '../model/Repository'
import RepositoryListItem from './RepositoryListItem'

type FilteredListProps = {
  repositories: readonly Repository[]
}

export default function FilteredList({ repositories }: FilteredListProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const selectId = useId()
  const languages = [...new Set(repositories.map((repository) => repository.language))]
  const visibleRepositories = selectedLanguage === ''
    ? repositories
    : repositories.filter((repository) => repository.language === selectedLanguage)

  return (
    <section aria-label="Список репозиторіїв" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Список репозиторіїв</h2>
      <label htmlFor={selectId} className="mt-4 block font-medium text-slate-900">
        Мова програмування
      </label>
      <select
        id={selectId}
        value={selectedLanguage}
        onChange={(event) => setSelectedLanguage(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 sm:w-auto"
      >
        <option value="">Усі</option>
        {languages.map((language) => (
          <option key={language} value={language}>{language}</option>
        ))}
      </select>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {visibleRepositories.map((repository) => (
          <RepositoryListItem key={repository.id} repository={repository} />
        ))}
      </ul>
    </section>
  )
}
