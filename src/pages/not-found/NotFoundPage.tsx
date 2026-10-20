import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Сторінку не знайдено</h1>
      <p className="text-slate-600">Перевірте адресу або поверніться до дашборду.</p>
      <Link to="/" className="w-fit rounded-lg bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800">Назад до дашборду</Link>
    </section>
  )
}
