'use client'

import { useEffect } from 'react'

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import ensures GSAP never runs on the server (it accesses window)
    let ctx: { revert: () => void } | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      // Normalize scroll on iOS Safari to prevent pin jitter
      ScrollTrigger.normalizeScroll(true)
      // Signal that GSAP is ready for components that check
      ;(window as typeof window & { __gsapReady?: boolean }).__gsapReady = true
      ctx = gsap.context(() => {})
    })()
    return () => ctx?.revert()
  }, [])

  return <>{children}</>
}
