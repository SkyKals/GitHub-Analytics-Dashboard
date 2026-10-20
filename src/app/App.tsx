import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useDashboardStore } from '../store/useDashboardStore'

export default function App() {
  const theme = useDashboardStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <AppRouter />
}
