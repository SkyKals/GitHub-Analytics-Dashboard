import type { ReactElement } from 'react'

type ChartType = 'bar' | 'pie'

type ChartTypeToggleProps = {
  value: ChartType
  onChange: (type: ChartType) => void
}

const buttonClassName = 'min-h-11 rounded-lg border px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-blue-600'

export default function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps): ReactElement {
  return (
    <div role="group" className="flex flex-wrap gap-2" aria-label="Тип графіка">
      <button
        type="button"
        aria-pressed={value === 'bar'}
        onClick={() => onChange('bar')}
        className={`${buttonClassName} ${value === 'bar' ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
      >
        Стовпчики
      </button>
      <button
        type="button"
        aria-pressed={value === 'pie'}
        onClick={() => onChange('pie')}
        className={`${buttonClassName} ${value === 'pie' ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
      >
        Кругова
      </button>
    </div>
  )
}
