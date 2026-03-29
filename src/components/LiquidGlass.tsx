'use client'

import { forwardRef } from 'react'

type LiquidGlassProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  as?: 'button' | 'span' | 'a' | 'div'
  className?: string
  style?: React.CSSProperties
  active?: boolean
  href?: string
  download?: boolean
  type?: string
  disabled?: boolean
  target?: string
  rel?: string
}

/**
 * Liquid glass effect — frosted translucent element with blur backdrop
 * and subtle border glow. Used for pills, buttons, tags, CTAs site-wide.
 */
const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(
  ({ children, as = 'span', className = '', style, active, ...props }, ref) => {
    const Tag = as as React.ElementType

    return (
      <Tag
        ref={ref}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '6px',
          border: `1px solid color-mix(in srgb, var(--color-accent) ${active ? '50%' : '25%'}, transparent)`,
          background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
          backdropFilter: 'blur(12px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
          color: 'var(--color-text)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'var(--text-label-sm)',
          letterSpacing: 'var(--tracking-normal)',
          textTransform: 'uppercase' as const,
          textDecoration: 'none',
          transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
          boxShadow: `
            inset 0 1px 0 0 color-mix(in srgb, white ${active ? '12%' : '8%'}, transparent),
            0 0 ${active ? '20px' : '12px'} 0 color-mix(in srgb, var(--color-accent) ${active ? '25%' : '10%'}, transparent)
          `,
          cursor: as === 'button' || as === 'a' ? 'pointer' : 'default',
          ...style,
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget
          el.style.borderColor = 'color-mix(in srgb, var(--color-accent) 50%, transparent)'
          el.style.boxShadow = `
            inset 0 1px 0 0 color-mix(in srgb, white 12%, transparent),
            0 0 20px 0 color-mix(in srgb, var(--color-accent) 20%, transparent)
          `
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget
          el.style.borderColor = 'color-mix(in srgb, var(--color-accent) 25%, transparent)'
          el.style.boxShadow = `
            inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent),
            0 0 12px 0 color-mix(in srgb, var(--color-accent) 10%, transparent)
          `
        }}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

LiquidGlass.displayName = 'LiquidGlass'
export default LiquidGlass
