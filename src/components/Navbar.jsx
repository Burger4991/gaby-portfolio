// src/components/Navbar.jsx
import ThemeSelector from './ThemeSelector'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-sm border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        className="text-xl font-semibold tracking-[0.2em] transition-opacity duration-200 hover:opacity-70 cursor-pointer"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
        aria-label="Gaby — back to top"
      >
        GABY
      </a>

      {/* Nav links + theme selector */}
      <div className="flex items-center gap-6 md:gap-8">
        <div className="flex gap-5 md:gap-8 text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--color-muted)' }}>
          <a
            href="#portfolio"
            className="transition-colors duration-200 cursor-pointer hover:text-[var(--color-accent)]"
            style={{ color: 'var(--color-muted)' }}
          >
            Work
          </a>
          <a
            href="#about"
            className="transition-colors duration-200 cursor-pointer hover:text-[var(--color-accent)]"
            style={{ color: 'var(--color-muted)' }}
          >
            About
          </a>
          <a
            href="#contact"
            className="transition-colors duration-200 cursor-pointer hover:text-[var(--color-accent)]"
            style={{ color: 'var(--color-muted)' }}
          >
            Contact
          </a>
        </div>
        <ThemeSelector />
      </div>
    </nav>
  )
}
