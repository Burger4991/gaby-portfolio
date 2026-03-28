// src/components/ThemeToggle.tsx
'use client'

import { Moon, Sun, Palette } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const ICONS = {
  dark: Sun,       // show what clicking will cycle toward
  light: Palette,
  catppuccin: Moon,
} as const

const LABELS = {
  dark: 'Switch to Frappé mode',
  light: 'Switch to Mocha mode',
  catppuccin: 'Switch to dark mode',
} as const

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const Icon = ICONS[theme]

  return (
    <button
      onClick={toggle}
      aria-label={LABELS[theme]}
      className="w-8 h-8 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 cursor-pointer"
      style={{ color: 'var(--color-muted)' }}
    >
      <Icon size={16} />
    </button>
  )
}
