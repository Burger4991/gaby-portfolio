import { useState } from 'react'

export default function PortfolioCard({ src, title, alt, category }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden aspect-[3/4] cursor-pointer group"
      style={{ backgroundColor: 'var(--color-card-bg)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
        style={{
          backgroundColor: 'var(--color-overlay)',
          opacity: hovered ? 0.85 : 0,
        }}
        aria-hidden="true"
      >
        <p
          className="text-xl font-light tracking-wide text-center px-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-bg)' }}
        >
          {title}
        </p>
        {category && (
          <p
            className="text-xs tracking-[0.2em] uppercase mt-2"
            style={{ color: 'var(--color-muted)' }}
          >
            {category}
          </p>
        )}
      </div>
    </div>
  )
}
