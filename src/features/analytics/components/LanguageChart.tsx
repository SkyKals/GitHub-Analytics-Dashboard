import type { ReactElement } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LanguageDatum } from '../model/groupRepositoriesByLanguage'

type ChartType = 'bar' | 'pie'

type LanguageChartProps = {
  data: readonly LanguageDatum[]
  type: ChartType
}

const CHART_COLORS = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed']

function LanguageValues({ data }: Pick<LanguageChartProps, 'data'>): ReactElement {
  return (
    <ul className="mt-4 space-y-1 text-sm text-slate-700 dark:text-slate-200" aria-label="Значення графіка мов">
      {data.map(({ language, count }) => <li key={language}>{language}: {count}</li>)}
    </ul>
  )
}

export default function LanguageChart({ data, type }: LanguageChartProps): ReactElement {
  if (data.length === 0) {
    return (
      <section aria-label="Графік мов" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Мови репозиторіїв</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Немає даних для графіка.</p>
      </section>
    )
  }

  return (
    <section aria-label="Графік мов" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Мови репозиторіїв</h2>
      <div className="mt-4 h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" tick={{ fill: '#64748b' }} />
              <YAxis allowDecimals={false} domain={[0, 'dataMax']} tick={{ fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="count" name="Репозиторії" fill="#2563eb" />
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={data} dataKey="count" nameKey="language" name="Репозиторії" outerRadius="80%" label>
                {data.map((datum, index) => <Cell key={datum.language} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      <LanguageValues data={data} />
    </section>
  )
}
