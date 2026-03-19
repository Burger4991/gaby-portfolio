// src/components/ThemeSelector.jsx
import { useTheme } from '../context/ThemeContext'

// Representative accent color for each flavor (Catppuccin peach values)
const FLAVOR_COLORS = {
  latte:     '#fe640b',
  frappe:    '#ef9f76',
  macchiato: '#f5a97f',
  mocha:     '#fab387',
}

const FLAVOR_LABELS = {
  latte:     'Latte (light)',
  frappe:    'Frappé',
  macchiato: 'Macchiato',
  mocha:     'Mocha (dark)',
}

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Color theme">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          aria-label={`Switch to ${FLAVOR_LABELS[t]}`}
          aria-pressed={theme === t}
          className="w-4 h-4 rounded-full cursor-pointer transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
          style={{
            backgroundColor: FLAVOR_COLORS[t],
            boxShadow: theme === t ? `0 0 0 2px var(--color-bg), 0 0 0 3.5px ${FLAVOR_COLORS[t]}` : 'none',
          }}
        />
      ))}
    </div>
  )
}
