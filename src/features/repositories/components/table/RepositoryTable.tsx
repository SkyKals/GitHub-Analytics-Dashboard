import type { GitHubRepository } from '../../model/GitHubRepository'
import type { RepositorySort, RepositorySortField } from '../../model/sortRepositories'

type RepositoryTableProps = {
  repositories: readonly GitHubRepository[]
  sort: RepositorySort
  onSortChange: (sort: RepositorySort) => void
}

function getNextSort(sort: RepositorySort, field: RepositorySortField): RepositorySort {
  return {
    field,
    direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
  }
}

function getAriaSort(sort: RepositorySort, field: RepositorySortField): 'ascending' | 'descending' | 'none' {
  if (sort.field !== field) return 'none'
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

export default function RepositoryTable({ repositories, sort, onSortChange }: RepositoryTableProps) {
  return (
    <div className="max-w-full overflow-x-auto" tabIndex={0}>
      <table className="min-w-[40rem] w-full border-collapse text-left text-sm">
        <caption className="sr-only">Публічні репозиторії GitHub</caption>
        <thead className="border-b border-slate-200 text-slate-600">
          <tr>
            <th scope="col" aria-sort={getAriaSort(sort, 'name')} className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={() => onSortChange(getNextSort(sort, 'name'))}
                className="rounded-md px-1 py-1 font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Назва
              </button>
            </th>
            <th scope="col" aria-sort="none" className="px-4 py-3 font-semibold">Мова</th>
            <th scope="col" aria-sort={getAriaSort(sort, 'stars')} className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={() => onSortChange(getNextSort(sort, 'stars'))}
                className="rounded-md px-1 py-1 font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Зірки
              </button>
            </th>
            <th scope="col" aria-sort="none" className="px-4 py-3 font-semibold">Форки</th>
            <th scope="col" aria-sort="none" className="px-4 py-3 font-semibold">ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {repositories.map((repository) => (
            <tr key={repository.id} className="text-slate-700">
              <th scope="row" className="max-w-xs px-4 py-3 font-medium">
                <a href={repository.htmlUrl} target="_blank" rel="noreferrer" className="break-words text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900">
                  {repository.fullName}
                </a>
              </th>
              <td className="px-4 py-3">{repository.language}</td>
              <td className="px-4 py-3 tabular-nums">{repository.stars}</td>
              <td className="px-4 py-3 tabular-nums">{repository.forks}</td>
              <td className="px-4 py-3 tabular-nums">{repository.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
