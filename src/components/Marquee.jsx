// src/components/Marquee.jsx
export default function Marquee() {
  const items = [
    'Resort & Activewear',
    'Bridal & Eveningwear',
    'Hand Illustrations',
    'Cut & Sew Knits',
    'Design & Direction',
    'Creative Direction',
    'Women\'s RTW',
  ]

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      className="w-full overflow-hidden py-5 border-y"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 text-xs font-semibold tracking-[0.3em] uppercase px-8"
            style={{ color: 'var(--color-muted)' }}
          >
            {item}
            <span style={{ color: 'var(--color-accent)' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
