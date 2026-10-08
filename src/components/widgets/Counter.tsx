import { useState } from 'react'

type CounterProps = {
  initialValue: number
}

export default function Counter({ initialValue }: CounterProps) {
  const [count, setCount] = useState(initialValue)

  function handleIncrement() {
    setCount((currentCount) => currentCount + 1)
  }

  function handleDecrement() {
    setCount((currentCount) => currentCount - 1)
  }

  function handleReset() {
    setCount(initialValue)
  }

  return (
    <section aria-label="Лічильник" className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Лічильник</h2>
      <output
        aria-label="Поточне значення"
        aria-live="polite"
        className="mt-3 block text-4xl font-semibold tabular-nums text-slate-900"
      >
        {count}
      </output>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          aria-label="Зменшити на 1"
          onClick={handleDecrement}
          className="min-h-11 min-w-11 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-900 hover:bg-slate-100"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Збільшити на 1"
          onClick={handleIncrement}
          className="min-h-11 min-w-11 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-900 hover:bg-slate-100"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Скинути лічильник"
          onClick={handleReset}
          className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-900 hover:bg-slate-100"
        >
          Скинути
        </button>
      </div>
    </section>
  )
}
