import { useId, useState } from 'react'
import type { Repository } from '../model/Repository'

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
    <section aria-label="Список репозиторіїв" className="rounded-2xl border border-slate-200 bg-white p-6">
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
          <li key={repository.id} className="min-w-0 rounded-xl border border-slate-200 p-4">
            <h3 className="break-words font-semibold text-slate-900">{repository.name}</h3>
            <p className="mt-1 text-sm text-slate-600">Мова: {repository.language}</p>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
              <div className="flex gap-2">
                <dt>Зірки</dt>
                <dd className="font-semibold tabular-nums">{repository.stars}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Форки</dt>
                <dd className="font-semibold tabular-nums">{repository.forks}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}
