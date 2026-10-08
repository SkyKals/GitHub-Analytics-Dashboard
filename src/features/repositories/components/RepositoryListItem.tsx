import type { Repository } from '../model/Repository'

type RepositoryListItemProps = {
  repository: Repository
}

export default function RepositoryListItem({ repository }: RepositoryListItemProps) {
  return (
    <li className="min-w-0 rounded-xl border border-slate-200 p-4">
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
  )
}
