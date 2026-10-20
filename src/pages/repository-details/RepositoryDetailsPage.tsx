import { Link, useParams } from 'react-router'
import EmptyState from '../../components/feedback/EmptyState'
import LoadingState from '../../components/feedback/LoadingState'
import useRepositoryDetails from '../../features/repositories/hooks/useRepositoryDetails'
import type { RepositoryContributor, RepositoryIssue } from '../../features/repositories/model/RepositoryDetails'

function errorText(error: { status?: number; kind: string } | null): string {
  if (!error) return ''
  if (error.status === 404) return 'Репозиторій не знайдено.'
  if (error.status === 403 || error.status === 429) return 'GitHub тимчасово обмежив запити. Спробуйте ще раз пізніше.'
  return error.kind === 'network' ? 'Не вдалося підключитися до GitHub.' : 'GitHub повернув некоректну відповідь.'
}

function Issues({ items }: { items: RepositoryIssue[] }) {
  if (items.length === 0) return <EmptyState message="Відкритих issues не знайдено на першій сторінці API." />
  return <ul className="grid gap-3">{items.map((issue) => <li key={issue.id} className="rounded-lg border border-slate-200 p-4"><a href={issue.htmlUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-700 underline">#{issue.number} {issue.title}</a><p className="mt-1 text-sm text-slate-500">Створено {new Date(issue.createdAt).toLocaleDateString('uk-UA')}</p></li>)}</ul>
}

function Contributors({ items }: { items: RepositoryContributor[] }) {
  if (items.length === 0) return <EmptyState message="Контриб’юторів не знайдено на першій сторінці API." />
  return <ul className="grid gap-3 sm:grid-cols-2">{items.map((contributor) => <li key={contributor.id} className="rounded-lg border border-slate-200 p-4"><a href={contributor.htmlUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-700 underline">{contributor.login}</a><span className="ml-2 text-sm text-slate-500">{contributor.contributions} внесків</span></li>)}</ul>
}

export default function RepositoryDetailsPage() {
  const { owner = '', repo = '' } = useParams()
  const { repository, issues, contributors, retry } = useRepositoryDetails(owner, repo)
  if (repository.loading) return <><Link to="/" className="text-blue-700 underline">← Назад до дашборду</Link><LoadingState /></>
  if (repository.error || !repository.data) return <section className="grid gap-4 rounded-2xl border border-red-200 bg-red-50 p-8"><Link to="/" className="text-blue-700 underline">← Назад до дашборду</Link><h1 className="text-2xl font-bold text-red-900">{repository.error?.status === 404 ? 'Репозиторій не знайдено' : 'Не вдалося завантажити репозиторій'}</h1><p className="text-red-800">{errorText(repository.error)}</p><button type="button" onClick={retry} className="w-fit rounded-lg border border-red-300 bg-white px-4 py-2 font-medium text-red-800">Спробувати ще раз</button></section>
  const data = repository.data
  return <article className="grid gap-6"><Link to="/" className="w-fit text-blue-700 underline">← Назад до дашборду</Link><header className="grid gap-3"><h1 className="text-3xl font-bold text-slate-900">{data.fullName}</h1><p className="text-slate-600">{data.description ?? 'Опис репозиторію відсутній.'}</p><p className="text-sm text-slate-500">Власник: {data.owner} · Гілка: {data.defaultBranch} · Ліцензія: {data.license ?? 'Не вказано'}</p><a href={data.htmlUrl} target="_blank" rel="noreferrer" className="w-fit text-blue-700 underline">Відкрити на GitHub</a></header><section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold text-slate-900">Відкриті issues</h2><p className="text-sm text-slate-500">Показано до 30 записів першої сторінки; pull requests вилучено.</p>{issues.loading ? <LoadingState /> : issues.error ? <p role="alert" className="text-red-700">{errorText(issues.error)}</p> : <Issues items={issues.data ?? []} />}</section><section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold text-slate-900">Контриб’ютори</h2><p className="text-sm text-slate-500">Показано до 30 записів першої сторінки.</p>{contributors.loading ? <LoadingState /> : contributors.error ? <p role="alert" className="text-red-700">{errorText(contributors.error)}</p> : <Contributors items={contributors.data ?? []} />}</section></article>
}
