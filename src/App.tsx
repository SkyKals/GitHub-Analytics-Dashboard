import DashboardLayout from './components/DashboardLayout'

export default function App() {
  return (
    <DashboardLayout>
      <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Аналітика GitHub
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Навчальний дашборд репозиторіїв.
        </p>
      </header>
    </DashboardLayout>
  )
}
