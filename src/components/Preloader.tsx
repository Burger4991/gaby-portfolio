'use client'
import { useEffect, useRef, useState } from 'react'

export default function Preloader() {
  const [done, setDone] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check sessionStorage gate
    if (sessionStorage.getItem('preloader_seen')) {
      setDone(true)
      return
    }
    sessionStorage.setItem('preloader_seen', '1')

    const run = async () => {
      const { gsap } = await import('gsap')
      if (!overlayRef.current || !textRef.current) return

      const tl = gsap.timeline({
        onComplete: () => setDone(true),
      })

      tl.fromTo(textRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
      .to(textRef.current, { duration: 0.6 })  // pause
      .to(overlayRef.current, {
        y: '-100%',
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }

    run()
  }, [])

  if (done) return null

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={textRef}
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontSize: '2rem',
          letterSpacing: '0.3em',
          color: 'var(--color-text)',
          opacity: 0,
        }}
      >
        G. GAMARGO
      </div>
    </div>
  )
}
