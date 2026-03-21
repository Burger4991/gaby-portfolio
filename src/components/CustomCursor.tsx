'use client'

import { useEffect, useRef } from 'react'

const LABELS: Record<string, string> = {
  view: 'VIEW',
  drag: 'DRAG',
  link: '↗',
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringWrapRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches

    // ── Touch: ripple + press highlight (all touch devices) ──────────────
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.changedTouches[0]

      // Ripple at touch point
      const ripple = document.createElement('div')
      ripple.className = 'cursor-ripple'
      ripple.style.left = touch.clientX + 'px'
      ripple.style.top = touch.clientY + 'px'
      document.body.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)

      // Press highlight on touched element
      const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
      if (target && !target.classList.contains('cursor-ripple')) {
        target.classList.add('cursor-pressed')
      }
    }

    const onTouchEnd = () => {
      document.querySelectorAll('.cursor-pressed').forEach((el) =>
        el.classList.remove('cursor-pressed')
      )
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // Touch-only devices: stop here, no desktop cursor needed
    if (isTouch) {
      return () => {
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchend', onTouchEnd)
        window.removeEventListener('touchcancel', onTouchEnd)
      }
    }

    // ── Desktop cursor ────────────────────────────────────────────────────
    const pos = { x: -200, y: -200 }
    const dot = { x: -200, y: -200 }
    const ring = { x: -200, y: -200 }
    let initialized = false
    let raf: number
    let scrollTimeout: ReturnType<typeof setTimeout> | undefined

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const updateContext = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y)
      const target = el?.closest('[data-cursor]') as HTMLElement | null
      const ctx = target?.dataset.cursor ?? ''

      if (ringRef.current) ringRef.current.dataset.state = ctx
      if (labelRef.current) {
        labelRef.current.textContent = ctx ? (LABELS[ctx] ?? '') : ''
        labelRef.current.style.opacity = ctx ? '1' : '0'
      }
    }

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY

      // Snap to position on first move so cursor doesn't drift in from off-screen
      if (!initialized) {
        dot.x = e.clientX
        dot.y = e.clientY
        ring.x = e.clientX
        ring.y = e.clientY
        initialized = true
      }

      updateContext(e.clientX, e.clientY)

      // Restore opacity after scroll
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringWrapRef.current) ringWrapRef.current.style.opacity = '1'
    }

    const onScroll = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0.15'
      if (ringWrapRef.current) ringWrapRef.current.style.opacity = '0.15'
      clearTimeout(scrollTimeout)
    }

    const loop = () => {
      dot.x = lerp(dot.x, pos.x, 0.4)
      dot.y = lerp(dot.y, pos.y, 0.4)
      ring.x = lerp(ring.x, pos.x, 0.08)
      ring.y = lerp(ring.y, pos.y, 0.08)

      if (dotRef.current) {
        // Offset by half dot size (6px) to center on cursor point
        dotRef.current.style.transform = `translate(${dot.x - 6}px, ${dot.y - 6}px)`
      }
      if (ringWrapRef.current) {
        // Ring wrap is zero-size — ring centers itself via CSS left/top offsets
        ringWrapRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      }

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringWrapRef} className="cursor-ring-wrap" aria-hidden="true">
        <div ref={ringRef} className="cursor-ring">
          <span ref={labelRef} className="cursor-label" />
        </div>
      </div>
    </>
  )
}
