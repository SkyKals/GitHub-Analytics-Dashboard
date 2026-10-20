import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext } from './themeContext'
import type { Theme } from './themeContext'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])
  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light')
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
