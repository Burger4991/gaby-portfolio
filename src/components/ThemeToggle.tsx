// src/components/ThemeToggle.tsx
'use client'

import { Moon, Sun, CloudSun, Palette } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import LiquidGlass from './LiquidGlass'

const ICONS = {
  dark: Sun,
  latte: CloudSun,
  frappe: Palette,
  catppuccin: Moon,
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
    <LiquidGlass
      as="button"
      onClick={toggle}
      aria-label={LABELS[theme]}
      style={{
        width: '2rem',
        height: '2rem',
        padding: 0,
        color: 'var(--color-muted)',
        borderRadius: '50%',
      }}
    >
      <Icon size={14} />
    </LiquidGlass>
  )
}
