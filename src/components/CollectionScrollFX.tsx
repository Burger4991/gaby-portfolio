'use client'

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export type CollectionScrollSection = {
  id?: string
  background: string
  leftLabel?: ReactNode
  title: string | ReactNode
  rightLabel?: ReactNode
}

type CollectionScrollFXProps = {
  sections: CollectionScrollSection[]
  fontFamily?: string
  gap?: number
  gridPaddingX?: number
  showProgress?: boolean
  bgTransition?: 'fade' | 'wipe'
  parallaxAmount?: number
  colors?: Partial<{
    text: string
    overlay: string
    pageBg: string
    stageBg: string
  }>
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

export default function CollectionScrollFX({
  sections,
  fontFamily = "'Cormorant Garamond', serif",
  gap = 1,
  gridPaddingX = 2,
  showProgress = true,
  bgTransition = 'wipe',
  parallaxAmount = 4,
  colors = {
    text: 'rgba(245,245,245,0.92)',
    overlay: 'rgba(10,8,6,0.55)',
    pageBg: '#0C0C0E',
    stageBg: '#0C0C0E',
  },
}: CollectionScrollFXProps) {
  const total = sections.length
  const [localIndex, setLocalIndex] = useState(0)
  const index = localIndex

  const fixedRef = useRef<HTMLDivElement | null>(null)
  const fixedSectionRef = useRef<HTMLDivElement | null>(null)
  const bgRefs = useRef<HTMLImageElement[]>([])
  const wordRefs = useRef<HTMLSpanElement[][]>([])
  const leftTrackRef = useRef<HTMLDivElement | null>(null)
  const rightTrackRef = useRef<HTMLDivElement | null>(null)
  const leftItemRefs = useRef<HTMLDivElement[]>([])
  const rightItemRefs = useRef<HTMLDivElement[]>([])
  const progressFillRef = useRef<HTMLDivElement | null>(null)
  const currentNumberRef = useRef<HTMLSpanElement | null>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const lastIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const isSnappingRef = useRef(false)
  const sectionTopRef = useRef<number[]>([])

  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  const tempWordBucket = useRef<HTMLSpanElement[]>([])

  const splitWords = (text: string) => {
    const words = text.split(/\s+/).filter(Boolean)
    return words.map((w, i) => (
      <span className="fx-word-mask" key={i}>
        <span className="fx-word" ref={(el) => { if (el) tempWordBucket.current.push(el) }}>
          {w}
        </span>
        {i < words.length - 1 ? ' ' : null}
      </span>
    ))
  }

  const WordsCollector = ({ onReady }: { onReady: () => void }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onReady() }, [])
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

  const measureRAF = (fn: () => void) => {
    if (typeof window === 'undefined') return
    requestAnimationFrame(() => requestAnimationFrame(fn))
  }

  const measureAndCenterLists = (toIndex: number, animate: boolean) => {
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
        gsap.to(trackRef.current, { y: targetY, duration: 0.63, ease: 'power3.out' })
      } else {
        gsap.set(trackRef.current, { y: targetY })
      }
    }
    measureRAF(() => {
      measureRAF(() => {
        centerTrack(leftTrackRef.current, leftItemRefs.current, leftTrackRef)
        centerTrack(rightTrackRef.current, rightItemRefs.current, rightTrackRef)
      })
    })
  }

  const changeSection = (to: number) => {
    if (to === lastIndexRef.current || isAnimatingRef.current) return
    const from = lastIndexRef.current
    const down = to > from
    isAnimatingRef.current = true
    setLocalIndex(to)

    if (currentNumberRef.current) currentNumberRef.current.textContent = String(to + 1).padStart(2, '0')
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${(to / (total - 1 || 1)) * 100}%`
    }

    const D = 0.7
    const outWords = wordRefs.current[from] || []
    const inWords = wordRefs.current[to] || []

    if (outWords.length) {
      gsap.to(outWords, { yPercent: down ? -100 : 100, opacity: 0, duration: D * 0.6, stagger: down ? 0.03 : -0.03, ease: 'power3.out' })
    }
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
      if (newBg) {
        gsap.set(newBg, { opacity: 1, clipPath: down ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', scale: 1, yPercent: 0 })
        gsap.to(newBg, { clipPath: 'inset(0 0 0 0)', duration: D, ease: 'power3.out' })
      }
      if (prevBg) gsap.to(prevBg, { opacity: 0, duration: D * 0.8, ease: 'power2.out' })
    }

    measureAndCenterLists(to, true)

    leftItemRefs.current.forEach((el, i) => {
      el.classList.toggle('active', i === to)
      gsap.to(el, { opacity: i === to ? 1 : 0.35, x: i === to ? 10 : 0, duration: D * 0.6, ease: 'power3.out' })
    })
    rightItemRefs.current.forEach((el, i) => {
      el.classList.toggle('active', i === to)
      gsap.to(el, { opacity: i === to ? 1 : 0.35, x: i === to ? -10 : 0, duration: D * 0.6, ease: 'power3.out' })
    })

    gsap.delayedCall(D, () => {
      lastIndexRef.current = to
      isAnimatingRef.current = false
    })
  }

  const goTo = (to: number, withScroll = true) => {
    const clamped = clamp(to, 0, total - 1)
    isSnappingRef.current = true
    changeSection(clamped)
    const pos = sectionTopRef.current[clamped]
    if (withScroll && typeof window !== 'undefined') {
      window.scrollTo({ top: pos, behavior: 'smooth' })
      setTimeout(() => { isSnappingRef.current = false }, 800)
    } else {
      setTimeout(() => { isSnappingRef.current = false }, 10)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const fixed = fixedRef.current
    const fs = fixedSectionRef.current
    if (!fixed || !fs || total === 0) return

    gsap.set(bgRefs.current, { opacity: 0, scale: 1.04, yPercent: 0 })
    if (bgRefs.current[0]) gsap.set(bgRefs.current[0], { opacity: 1, scale: 1 })

    wordRefs.current.forEach((words, sIdx) => {
      words.forEach((w) => {
        gsap.set(w, { yPercent: sIdx === 0 ? 0 : 100, opacity: sIdx === 0 ? 1 : 0 })
      })
    })

    computePositions()
    measureAndCenterLists(0, false)

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
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${(lastIndexRef.current / (total - 1 || 1)) * 100}%`
        }
      },
    })
    stRef.current = st

    const ro = new ResizeObserver(() => {
      computePositions()
      measureAndCenterLists(lastIndexRef.current, false)
      ScrollTrigger.refresh()
    })
    ro.observe(fs)

    return () => { ro.disconnect(); st.kill(); stRef.current = null }
  }, [total, prefersReduced, bgTransition, parallaxAmount])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    leftItemRefs.current.forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: i === 0 ? 1 : 0.35, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power3.out' })
    })
    rightItemRefs.current.forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: i === 0 ? 1 : 0.35, y: 0, duration: 0.5, delay: 0.2 + i * 0.06, ease: 'power3.out' })
    })
    measureAndCenterLists(0, false)
  }, [])

  const cssVars: CSSProperties = {
    ['--fx-font' as string]: fontFamily,
    ['--fx-text' as string]: colors.text ?? 'rgba(245,245,245,0.92)',
    ['--fx-overlay' as string]: colors.overlay ?? 'rgba(0,0,0,0.35)',
    ['--fx-page-bg' as string]: colors.pageBg ?? '#0C0C0E',
    ['--fx-stage-bg' as string]: colors.stageBg ?? '#0C0C0E',
    ['--fx-gap' as string]: `${gap}rem`,
    ['--fx-grid-px' as string]: `${gridPaddingX}rem`,
    ['--fx-row-gap' as string]: '10px',
  }

  return (
    <div className="fx" style={{ ...cssVars }} aria-label="Collection section navigator">
      <div className="fx-scroll">
        <div className="fx-fixed-section" ref={fixedSectionRef}>
          <div className="fx-fixed" ref={fixedRef}>
            {/* Backgrounds */}
            <div className="fx-bgs" aria-hidden="true">
              {sections.map((s, i) => (
                <div className="fx-bg" key={s.id ?? i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={(el) => { if (el) bgRefs.current[i] = el }}
                    src={s.background}
                    alt=""
                    className="fx-bg-img"
                  />
                  <div className="fx-bg-overlay" />
                </div>
              ))}
            </div>

            {/* Grid content */}
            <div className="fx-grid">
              <div className="fx-content">
                {/* Left labels */}
                <div className="fx-left" role="list">
                  <div className="fx-track" ref={leftTrackRef}>
                    {sections.map((s, i) => (
                      <div
                        key={`L-${s.id ?? i}`}
                        className={`fx-item fx-left-item${i === index ? ' active' : ''}`}
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

                {/* Center title */}
                <div className="fx-center">
                  {sections.map((s, sIdx) => {
                    tempWordBucket.current = []
                    const isString = typeof s.title === 'string'
                    return (
                      <div key={`C-${s.id ?? sIdx}`} className={`fx-featured${sIdx === index ? ' active' : ''}`}>
                        <h2 className="fx-featured-title">
                          {isString ? splitWords(s.title as string) : s.title}
                        </h2>
                        <WordsCollector
                          onReady={() => {
                            if (tempWordBucket.current.length) {
                              wordRefs.current[sIdx] = [...tempWordBucket.current]
                            }
                            tempWordBucket.current = []
                          }}
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Right labels */}
                <div className="fx-right" role="list">
                  <div className="fx-track" ref={rightTrackRef}>
                    {sections.map((s, i) => (
                      <div
                        key={`R-${s.id ?? i}`}
                        className={`fx-item fx-right-item${i === index ? ' active' : ''}`}
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

              {/* Footer / progress */}
              {showProgress && (
                <div className="fx-footer">
                  <div className="fx-progress">
                    <div className="fx-progress-numbers">
                      <span ref={currentNumberRef}>{String(index + 1).padStart(2, '0')}</span>
                      <span>{String(total).padStart(2, '0')}</span>
                    </div>
                    <div className="fx-progress-bar">
                      <div className="fx-progress-fill" ref={progressFillRef} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fx {
          width: 100%;
          overflow: hidden;
          background: var(--fx-page-bg);
          font-family: var(--fx-font);
        }
        .fx-fixed-section {
          height: ${Math.max(1, total)}00vh;
          position: relative;
        }
        .fx-fixed {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: var(--fx-stage-bg);
        }
        .fx-bgs {
          position: absolute;
          inset: 0;
          background: var(--fx-stage-bg);
          z-index: 1;
        }
        .fx-bg {
          position: absolute;
          inset: 0;
        }
        .fx-bg-img {
          position: absolute;
          inset: -10% 0 -10% 0;
          width: 100%;
          height: 120%;
          object-fit: cover;
          filter: brightness(0.75);
          opacity: 0;
          will-change: transform, opacity;
        }
        .fx-bg-overlay {
          position: absolute;
          inset: 0;
          background: var(--fx-overlay);
        }
        .fx-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--fx-gap);
          padding: 0 var(--fx-grid-px);
          position: relative;
          height: 100%;
          z-index: 2;
        }
        .fx-content {
          grid-column: 1 / 13;
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1.4fr 1fr;
          align-items: center;
          height: 100%;
          padding: 0 var(--fx-grid-px);
        }
        .fx-left,
        .fx-right {
          height: 60vh;
          overflow: hidden;
          display: grid;
          align-content: center;
        }
        .fx-left { justify-items: start; }
        .fx-right { justify-items: end; }
        .fx-track { will-change: transform; }
        .fx-item {
          color: var(--fx-text);
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          line-height: 1;
          margin: calc(var(--fx-row-gap) / 2) 0;
          opacity: 0.35;
          position: relative;
          font-size: clamp(0.65rem, 1.2vw, 0.9rem);
          user-select: none;
          cursor: pointer;
        }
        .fx-left-item.active,
        .fx-right-item.active { opacity: 1; }
        .fx-left-item.active { transform: translateX(10px); padding-left: 14px; }
        .fx-right-item.active { transform: translateX(-10px); padding-right: 14px; }
        .fx-left-item.active::before,
        .fx-right-item.active::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 5px;
          background: var(--color-accent, #B8965A);
          border-radius: 50%;
        }
        .fx-left-item.active::before { left: 0; }
        .fx-right-item.active::after { right: 0; }
        .fx-center {
          display: grid;
          place-items: center;
          text-align: center;
          height: 60vh;
          overflow: hidden;
        }
        .fx-featured {
          position: absolute;
          opacity: 0;
          visibility: hidden;
        }
        .fx-featured.active {
          opacity: 1;
          visibility: visible;
        }
        .fx-featured-title {
          margin: 0;
          color: var(--fx-text);
          font-weight: 300;
          font-style: italic;
          letter-spacing: 0.02em;
          font-size: clamp(2.5rem, 7vw, 6.5rem);
          line-height: 1;
        }
        .fx-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: middle;
        }
        .fx-word { display: inline-block; vertical-align: middle; }
        .fx-footer {
          grid-column: 1 / 13;
          align-self: end;
          padding-bottom: 4vh;
          text-align: center;
        }
        .fx-progress {
          width: 180px;
          height: 1px;
          margin: 0 auto;
          background: rgba(245,245,245,0.2);
          position: relative;
        }
        .fx-progress-fill {
          position: absolute;
          inset: 0 auto 0 0;
          width: 0%;
          background: var(--color-accent, #B8965A);
          height: 100%;
          transition: width 0.3s ease;
        }
        .fx-progress-numbers {
          position: absolute;
          inset: auto 0 calc(100% + 6px) 0;
          display: flex;
          justify-content: space-between;
          font-family: 'Manrope', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--fx-text);
          opacity: 0.6;
        }
        @media (max-width: 768px) {
          .fx-content { grid-template-columns: 1fr; place-items: center; }
          .fx-left, .fx-right { display: none; }
          .fx-center { height: 70vh; }
          .fx-featured-title { font-size: clamp(2rem, 10vw, 4rem); }
        }
      `}</style>
    </div>
  )
}
