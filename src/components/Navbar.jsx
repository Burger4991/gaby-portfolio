// src/components/Navbar.jsx
import ThemeSelector from './ThemeSelector'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-sm border-b"
      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
    >
      <span
        className="text-xl font-semibold tracking-[0.2em]"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
      >
        GABY
      </span>
      <div className="flex items-center gap-8">
        <div className="flex gap-6 md:gap-10 text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--color-muted)' }}>
          <a href="#portfolio" className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">Work</a>
          <a href="#about"     className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">About</a>
          <a href="#contact"   className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">Contact</a>
        </div>
        <ThemeSelector />
      </div>
    </nav>
  )
}
