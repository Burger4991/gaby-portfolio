// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const THEMES = ['latte', 'frappe', 'macchiato', 'mocha']
const DEFAULT_THEME = 'latte'
const STORAGE_KEY = 'gaby-portfolio-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return THEMES.includes(saved) ? saved : DEFAULT_THEME
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
