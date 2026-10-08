import { useState } from 'react'
import { Moon } from 'lucide-react'

export default function Toggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <section
      aria-label="Оформлення секції"
      className={`rounded-2xl border p-6 shadow-sm ${
        isDarkMode
          ? 'border-slate-700 bg-slate-900 text-slate-50'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <h2 className="text-lg font-semibold">Оформлення секції</h2>
      <p aria-live="polite" className="mt-3">
        Поточний режим: {isDarkMode ? 'темний' : 'світлий'}
      </p>
      <button
        type="button"
        aria-pressed={isDarkMode}
        onClick={() => setIsDarkMode((currentMode) => !currentMode)}
          className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 font-medium ${
          isDarkMode
            ? 'border-slate-500 bg-slate-700 text-slate-50 hover:bg-slate-600'
            : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
        }`}
        >
          <Moon size={18} aria-hidden="true" />
          <span className="ml-2">Темний режим</span>
      </button>
    </section>
  )
}
