// src/components/ThemeToggle.tsx
'use client'

import { Moon, Sun, CloudSun, Palette } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const ICONS = {
  dark: Sun,          // next: Latte (light)
  latte: CloudSun,    // next: Frappé (mid-dark)
  frappe: Palette,    // next: Mocha (deep dark)
  catppuccin: Moon,   // next: Dark Luxury
} as const

const LABELS = {
  dark: 'Switch to Latte',
  latte: 'Switch to Frappé',
  frappe: 'Switch to Mocha',
  catppuccin: 'Switch to Dark Luxury',
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
