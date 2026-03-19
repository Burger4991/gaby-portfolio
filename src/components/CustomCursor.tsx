'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let rafId: number
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      const animate = () => {
        ringPos.current.x = lerp(ringPos.current.x, e.clientX, 0.12)
        ringPos.current.y = lerp(ringPos.current.y, e.clientY, 0.12)
        if (ringRef.current) {
          ringRef.current.style.left = ringPos.current.x + 'px'
          ringRef.current.style.top = ringPos.current.y + 'px'
        }
        rafId = requestAnimationFrame(animate)
      }
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(animate)
    }
    const onEnter = () => ringRef.current?.classList.add('hovering')
    const onLeave = () => ringRef.current?.classList.remove('hovering')
    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
