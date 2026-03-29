'use client'

import React, {
  type CSSProperties,
  type ReactNode,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type Section = {
  id?: string
  background: string
  gradient?: string  // CSS gradient string — if provided, replaces background image
  leftLabel?: ReactNode
  title: string | ReactNode
  rightLabel?: ReactNode
  /** If provided, renders this content over the background instead of the default title/nav layout */
  content?: ReactNode
}

type FullScreenFXProps = {
  sections: Section[]
  className?: string
  style?: CSSProperties
  header?: ReactNode
  footer?: ReactNode
  showProgress?: boolean
  durations?: { change?: number; snap?: number }
  bgTransition?: 'fade' | 'wipe'
  parallaxAmount?: number
  onIndexChange?: (index: number) => void
  initialIndex?: number
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenFXProps>(
  (
    {
      sections,
      className,
      style,
      header,
      footer,
      showProgress = true,
      durations = { change: 0.7, snap: 800 },
      bgTransition = 'fade',
      parallaxAmount = 4,
      onIndexChange,
      initialIndex = 0,
    },
    ref
  ) => {
    const total = sections.length
    const [index, setIndex] = useState(clamp(initialIndex, 0, Math.max(0, total - 1)))

    const rootRef = useRef<HTMLDivElement | null>(null)
    const fixedRef = useRef<HTMLDivElement | null>(null)
    const fixedSectionRef = useRef<HTMLDivElement | null>(null)
    const bgRefs = useRef<HTMLImageElement[]>([])
    const contentRefs = useRef<HTMLDivElement[]>([])
    const wordRefs = useRef<HTMLSpanElement[][]>([])
    const leftTrackRef = useRef<HTMLDivElement | null>(null)
    const rightTrackRef = useRef<HTMLDivElement | null>(null)
    const leftItemRefs = useRef<HTMLDivElement[]>([])
    const rightItemRefs = useRef<HTMLDivElement[]>([])
    const progressFillRef = useRef<HTMLDivElement | null>(null)
    const currentNumberRef = useRef<HTMLSpanElement | null>(null)
    const lastIndexRef = useRef(index)
    const isAnimatingRef = useRef(false)
    const isSnappingRef = useRef(false)
    const sectionTopRef = useRef<number[]>([])

    const prefersReduced = useMemo(() => {
      if (typeof window === 'undefined') return false
      return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    }, [])

    const tempWordBucket = useRef<HTMLSpanElement[]>([])
    const splitWords = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean)
      return words.map((w, i) => (
        <span className="fx-word-mask" key={i}>
          <span
            className="fx-word"
            ref={(el) => { if (el) tempWordBucket.current.push(el) }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))
    }

    const WordsCollector = ({ onReady }: { onReady: () => void }) => {
      useEffect(() => onReady(), [])
      return null
    }

    const computePositions = () => {
      const el = fixedSectionRef.current
      if (!el) return
      const top = el.offsetTop
      const h = el.offsetHeight
      const arr: number[] = []
      for (let i = 0; i < total; i++) arr.push(top + (h * i) / total)
      sectionTopRef.current = arr
    }

    const measureAndCenterLists = (toIndex = index, animate = true) => {
      const centerTrack = (
        container: HTMLDivElement | null,
        items: HTMLDivElement[],
        trackRef: React.MutableRefObject<HTMLDivElement | null>
      ) => {
        if (!container || items.length === 0 || !trackRef.current) return
        const first = items[0]
        const second = items[1]
        const contRect = container.getBoundingClientRect()
        let rowH = first.getBoundingClientRect().height
        if (second) rowH = second.getBoundingClientRect().top - first.getBoundingClientRect().top
        const targetY = contRect.height / 2 - rowH / 2 - toIndex * rowH
        if (animate) {
          import('gsap').then(({ gsap }) => {
            gsap.to(trackRef.current, { y: targetY, duration: (durations.change ?? 0.7) * 0.9, ease: 'power3.out' })
          })
        } else {
          import('gsap').then(({ gsap }) => {
            gsap.set(trackRef.current, { y: targetY })
          })
        }
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          centerTrack(leftTrackRef.current?.parentElement as HTMLDivElement, leftItemRefs.current, leftTrackRef)
          centerTrack(rightTrackRef.current?.parentElement as HTMLDivElement, rightItemRefs.current, rightTrackRef)
        })
      })
    }

    useLayoutEffect(() => {
      if (typeof window === 'undefined') return
      const fixed = fixedRef.current
      const fs = fixedSectionRef.current
      if (!fixed || !fs || total === 0) return

      let cleanup: (() => void) | null = null

      async function init() {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        gsap.set(bgRefs.current, { opacity: 0, scale: 1.04, yPercent: 0 })
        if (bgRefs.current[0]) gsap.set(bgRefs.current[0], { opacity: 1, scale: 1 })

        wordRefs.current.forEach((words, sIdx) => {
          words.forEach((w) => {
            gsap.set(w, { yPercent: sIdx === index ? 0 : 100, opacity: sIdx === index ? 1 : 0 })
          })
        })

        computePositions()
        measureAndCenterLists(index, false)

        const st = ScrollTrigger.create({
          trigger: fs,
          start: 'top top',
          end: 'bottom bottom',
          pin: fixed,
          pinSpacing: true,
          onUpdate: (self) => {
            if (prefersReduced || isSnappingRef.current) return
            const prog = self.progress
            const target = Math.min(total - 1, Math.floor(prog * total))
            if (target !== lastIndexRef.current && !isAnimatingRef.current) {
              const next = lastIndexRef.current + (target > lastIndexRef.current ? 1 : -1)
              goTo(next, false)
            }
          },
        })

        const ro = new ResizeObserver(() => {
          computePositions()
          measureAndCenterLists(lastIndexRef.current, false)
          ScrollTrigger.refresh()
        })
        if (fs) ro.observe(fs)

        cleanup = () => {
          ro.disconnect()
          st.kill()
        }
      }

      init()
      return () => { cleanup?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total])

    const changeSection = async (to: number) => {
      if (to === lastIndexRef.current || isAnimatingRef.current) return
      const from = lastIndexRef.current
      const down = to > from
      isAnimatingRef.current = true

      setIndex(to)
      onIndexChange?.(to)

      if (currentNumberRef.current) currentNumberRef.current.textContent = String(to + 1).padStart(2, '0')
      if (progressFillRef.current) progressFillRef.current.style.width = `${(to / (total - 1 || 1)) * 100}%`

      const { gsap } = await import('gsap')
      const D = durations.change ?? 0.7

      const outWords = wordRefs.current[from] || []
      const inWords = wordRefs.current[to] || []
      if (outWords.length) gsap.to(outWords, { yPercent: down ? -100 : 100, opacity: 0, duration: D * 0.6, stagger: down ? 0.03 : -0.03, ease: 'power3.out' })
      if (inWords.length) {
        gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 })
        gsap.to(inWords, { yPercent: 0, opacity: 1, duration: D, stagger: down ? 0.05 : -0.05, ease: 'power3.out' })
      }

      const prevBg = bgRefs.current[from]
      const newBg = bgRefs.current[to]
      if (bgTransition === 'fade') {
        if (newBg) { gsap.set(newBg, { opacity: 0, scale: 1.04, yPercent: down ? 1 : -1 }); gsap.to(newBg, { opacity: 1, scale: 1, yPercent: 0, duration: D, ease: 'power2.out' }) }
        if (prevBg) gsap.to(prevBg, { opacity: 0, yPercent: down ? -parallaxAmount : parallaxAmount, duration: D, ease: 'power2.out' })
      } else {
        if (newBg) { gsap.set(newBg, { opacity: 1, clipPath: down ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', scale: 1, yPercent: 0 }); gsap.to(newBg, { clipPath: 'inset(0 0 0 0)', duration: D, ease: 'power3.out' }) }
        if (prevBg) gsap.to(prevBg, { opacity: 0, duration: D * 0.8, ease: 'power2.out' })
      }

      // Animate content panels
      const prevContent = contentRefs.current[from]
      const newContent = contentRefs.current[to]
      if (prevContent) gsap.to(prevContent, { opacity: 0, duration: D * 0.4, ease: 'power2.out', onComplete: () => { prevContent.style.visibility = 'hidden'; prevContent.style.pointerEvents = 'none' } })
      if (newContent) { newContent.style.visibility = 'visible'; newContent.style.pointerEvents = 'auto'; gsap.fromTo(newContent, { opacity: 0 }, { opacity: 1, duration: D * 0.6, delay: D * 0.2, ease: 'power2.out' }) }

      measureAndCenterLists(to, true)

      leftItemRefs.current.forEach((el, i) => {
        el.classList.toggle('active', i === to)
        gsap.to(el, { opacity: i === to ? 1 : 0.35, x: i === to ? 10 : 0, duration: D * 0.6, ease: 'power3.out' })
      })
      rightItemRefs.current.forEach((el, i) => {
        el.classList.toggle('active', i === to)
        gsap.to(el, { opacity: i === to ? 1 : 0.35, x: i === to ? -10 : 0, duration: D * 0.6, ease: 'power3.out' })
      })

      gsap.delayedCall(D, () => { lastIndexRef.current = to; isAnimatingRef.current = false })
    }

    const goTo = (to: number, withScroll = true) => {
      const clamped = clamp(to, 0, total - 1)
      isSnappingRef.current = true
      changeSection(clamped)
      const pos = sectionTopRef.current[clamped]
      const snapMs = durations.snap ?? 800
      if (withScroll && typeof window !== 'undefined') {
        window.scrollTo({ top: pos, behavior: 'smooth' })
        setTimeout(() => (isSnappingRef.current = false), snapMs)
      } else {
        setTimeout(() => (isSnappingRef.current = false), 10)
      }
    }

    useEffect(() => {
      import('gsap').then(({ gsap }) => {
        leftItemRefs.current.forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: i === index ? 1 : 0.35, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power3.out' })
        })
        rightItemRefs.current.forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: i === index ? 1 : 0.35, y: 0, duration: 0.5, delay: 0.2 + i * 0.06, ease: 'power3.out' })
        })
      })
      measureAndCenterLists(index, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={['fx', className].filter(Boolean).join(' ')}
        style={style}
        aria-label="Full screen scroll slideshow"
      >
        <div className="fx-scroll">
          <div className="fx-fixed-section" ref={fixedSectionRef}>
            <div className="fx-fixed" ref={fixedRef}>
              <div className="fx-bgs" aria-hidden="true">
                {sections.map((s, i) => (
                  <div className="fx-bg" key={s.id ?? i}>
                    {s.gradient ? (
                      <div
                        ref={(el) => { if (el) bgRefs.current[i] = el as unknown as HTMLImageElement }}
                        className="fx-bg-gradient"
                        style={{ background: s.gradient }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        ref={(el) => { if (el) bgRefs.current[i] = el }}
                        src={s.background}
                        alt=""
                        className="fx-bg-img"
                      />
                    )}
                    <div className="fx-bg-overlay" />
                  </div>
                ))}
              </div>

              {/* Custom content panels — rendered over background when section has content */}
              {sections.map((s, i) => s.content ? (
                <div
                  key={`content-${s.id ?? i}`}
                  ref={(el) => { if (el) contentRefs.current[i] = el }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    opacity: i === 0 ? 1 : 0,
                    visibility: i === 0 ? 'visible' : 'hidden',
                    pointerEvents: i === 0 ? 'auto' : 'none',
                  }}
                >
                  {s.content}
                </div>
              ) : null)}

              <div className="fx-grid">
                {header && <div className="fx-header">{header}</div>}

                <div className="fx-content">
                  <div className="fx-left" role="list">
                    <div className="fx-track" ref={leftTrackRef}>
                      {sections.map((s, i) => (
                        <div
                          key={`L-${s.id ?? i}`}
                          className={`fx-item fx-left-item ${i === index ? 'active' : ''}`}
                          ref={(el) => { if (el) leftItemRefs.current[i] = el }}
                          onClick={() => goTo(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {s.leftLabel}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="fx-center">
                    {sections.map((s, sIdx) => {
                      tempWordBucket.current = []
                      const isString = typeof s.title === 'string'
                      return (
                        <div key={`C-${s.id ?? sIdx}`} className={`fx-featured ${sIdx === index ? 'active' : ''}${s.content ? ' has-content' : ''}`}>
                          <h3 className="fx-featured-title">
                            {isString ? splitWords(s.title as string) : s.title}
                          </h3>
                          <WordsCollector
                            onReady={() => {
                              if (tempWordBucket.current.length) wordRefs.current[sIdx] = [...tempWordBucket.current]
                              tempWordBucket.current = []
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>

                  <div className="fx-right" role="list">
                    <div className="fx-track" ref={rightTrackRef}>
                      {sections.map((s, i) => (
                        <div
                          key={`R-${s.id ?? i}`}
                          className={`fx-item fx-right-item ${i === index ? 'active' : ''}`}
                          ref={(el) => { if (el) rightItemRefs.current[i] = el }}
                          onClick={() => goTo(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {s.rightLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="fx-footer">
                  {footer && <div className="fx-footer-title">{footer}</div>}
                  {showProgress && (
                    <div className="fx-progress">
                      <div className="fx-progress-numbers">
                        <span ref={currentNumberRef}>{String(index + 1).padStart(2, '0')}</span>
                        <span>{String(total).padStart(2, '0')}</span>
                      </div>
                      <div className="fx-progress-bar">
                        <div className="fx-progress-fill" ref={progressFillRef} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .fx { width: 100%; overflow: hidden; background: var(--color-bg); color: var(--color-text); font-family: 'Manrope', sans-serif; letter-spacing: -0.02em; }
          .fx-fixed-section { height: ${Math.max(1, total + 1)}00vh; position: relative; }
          .fx-fixed { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; background: var(--color-bg); }
          .fx-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; padding: 0 2rem; position: relative; height: 100%; z-index: 10; pointer-events: none; }
          .fx-grid * { pointer-events: auto; }
          .fx-bgs { position: absolute; inset: 0; background: var(--color-overlay); z-index: 1; }
          .fx-bg { position: absolute; inset: 0; }
          .fx-bg-img { position: absolute; inset: -10% 0 -10% 0; width: 100%; height: 120%; object-fit: cover; filter: brightness(0.7); opacity: 0; will-change: transform, opacity; }
          .fx-bg-gradient { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; will-change: opacity; }
          .fx-bg-overlay { position: absolute; inset: 0; background: var(--color-overlay-scrim); }
          .fx-header { grid-column: 1 / 13; align-self: start; padding-top: 6vh; font-size: clamp(2rem, 9vw, 9rem); line-height: 0.86; text-align: center; color: var(--color-overlay-text); }
          .fx-content { grid-column: 1 / 13; position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1.3fr 1fr; align-items: center; height: 100%; padding: 0 2rem; }
          .fx-left, .fx-right { height: 60vh; overflow: hidden; display: grid; align-content: center; }
          .fx-left { justify-items: start; }
          .fx-right { justify-items: end; }
          .fx-track { will-change: transform; }
          .fx-item { color: var(--color-overlay-text); font-weight: 600; letter-spacing: 0em; line-height: 1; margin: 5px 0; opacity: 0.35; transition: opacity 0.3s ease, transform 0.3s ease; position: relative; font-size: clamp(0.75rem, 1.4vw, 1.1rem); user-select: none; cursor: pointer; font-family: 'Manrope', sans-serif; }
          .fx-left-item.active, .fx-right-item.active { opacity: 1; }
          .fx-left-item.active { transform: translateX(10px); padding-left: 16px; }
          .fx-right-item.active { transform: translateX(-10px); padding-right: 16px; }
          .fx-left-item.active::before, .fx-right-item.active::after { content: ''; position: absolute; top: 50%; transform: translateY(-50%); width: 5px; height: 5px; background: var(--color-accent); border-radius: 50%; }
          .fx-left-item.active::before { left: 0; }
          .fx-right-item.active::after { right: 0; }
          .fx-center { display: grid; place-items: center; text-align: center; height: 60vh; overflow: hidden; }
          .fx-featured { position: absolute; opacity: 0; visibility: hidden; }
          .fx-featured.active { opacity: 1; visibility: visible; }
          .fx-featured.has-content { opacity: 0 !important; visibility: hidden !important; }
          .fx-featured-title { margin: 0; color: var(--color-overlay-heading); font-weight: 300; font-style: italic; letter-spacing: 0.02em; font-size: clamp(2.5rem, 6vw, 5rem); font-family: 'Cormorant Garamond', serif; }
          .fx-word-mask { display: inline-block; overflow: hidden; vertical-align: middle; }
          .fx-word { display: inline-block; vertical-align: middle; }
          .fx-footer { grid-column: 1 / 13; align-self: end; padding-bottom: 5vh; text-align: center; }
          .fx-footer-title { color: var(--color-overlay-text); font-size: clamp(1.6rem, 7vw, 7rem); font-weight: 300; font-style: italic; letter-spacing: 0.02em; line-height: 0.9; font-family: 'Cormorant Garamond', serif; }
          .fx-progress { width: 200px; height: 2px; margin: 1rem auto 0; background: color-mix(in srgb, var(--color-overlay-text) 28%, transparent); position: relative; }
          .fx-progress-fill { position: absolute; inset: 0 auto 0 0; width: 0%; background: var(--color-accent); height: 100%; transition: width 0.3s ease; }
          .fx-progress-numbers { position: absolute; inset: auto 0 100% 0; display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--color-overlay-muted); letter-spacing: 0.15em; margin-bottom: 4px; }
          @media (max-width: 900px) {
            .fx-content { grid-template-columns: 1fr; row-gap: 3vh; place-items: center; }
            .fx-left, .fx-right, .fx-center { height: auto; }
            .fx-left, .fx-right { justify-items: center; }
            .fx-track { transform: none !important; }
          }
        `}</style>
      </div>
    )
  }
)

FullScreenScrollFX.displayName = 'FullScreenScrollFX'
export default FullScreenScrollFX
