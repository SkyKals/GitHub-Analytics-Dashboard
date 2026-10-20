import { Moon, Sun } from 'lucide-react'
import { useDashboardStore } from '../../../store/useDashboardStore'

export default function ThemeToggle() {
  const theme = useDashboardStore((state) => state.theme)
  const toggleTheme = useDashboardStore((state) => state.toggleTheme)
  const dark = theme === 'dark'
  return <button type="button" aria-label={dark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'} aria-pressed={dark} onClick={toggleTheme} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"><span aria-hidden="true">{dark ? <Sun size={18} /> : <Moon size={18} />}</span><span className="ml-2">{dark ? 'Світла тема' : 'Темна тема'}</span></button>
}
