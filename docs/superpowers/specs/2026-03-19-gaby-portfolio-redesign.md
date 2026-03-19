# Gaby Portfolio — Full Redesign Spec
**Date:** 2026-03-19
**Status:** Approved for implementation

---

## Overview

Rebuild Gaby Gamargo's fashion portfolio from the current Vite + React + Framer Motion stack to Next.js 15 + GSAP + Sanity CMS. The goal is a premium, award-caliber fashion portfolio that Gaby can eventually manage herself — updating photos, bio, and portfolio items without touching code.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, SSG) |
| Styling | Tailwind CSS v4 |
| Scroll animations | GSAP 3 + ScrollTrigger |
| Text animations | Custom `splitWords` utility (see Animation Architecture) |
| UI micro-interactions | Framer Motion (hover states, lightbox, overlay nav) |
| CMS | Sanity v3 (Studio embedded at `/studio` via Next.js route) |
| Images | `next/image` + Sanity image CDN |
| Contact form | Next.js Server Action + Resend API |
| Analytics | Vercel Analytics |
| Deployment | Vercel (existing project) |

**Fonts:** Cormorant Garamond (headings, italic) + Manrope (body, UI) — unchanged from current.

**Note on SplitText:** GSAP's SplitText plugin requires a paid Club GSAP license. This project uses a lightweight custom `splitWords` utility instead — a plain function that splits a string into `<span>` elements, one per word, which GSAP then animates. No paid plugin required.

---

## Color System

Replaces Catppuccin entirely. Two themes, one toggle. Same CSS custom property architecture on `html[data-theme]`.

### Dark (default)
```css
--color-bg:           #0C0C0E
--color-surface:      #111116
--color-border:       #1F1F25
--color-text:         #EDE8DF
--color-muted:        #5C5349
--color-accent:       #B8965A  /* gold */
--color-accent-hover: #CCA96A
--color-card-bg:      #18181E
--color-overlay:      #0C0C0E
```

### Light (Warm Ivory)
```css
--color-bg:           #F8F4EE
--color-surface:      #F2EBE1
--color-border:       #E5DDD3
--color-text:         #1C1610
--color-muted:        #9A8E84
--color-accent:       #A0673A  /* terracotta */
--color-accent-hover: #B5784A
--color-card-bg:      #EDE7DF
--color-overlay:      #F8F4EE
```

Theme toggle: single button in navbar (moon/sun icon). Default on first visit: **dark**. Preference saved to localStorage.

---

## Site Structure

```
/              — main portfolio page (SSG)
/work/[slug]   — case study pages (placeholder route, no pages built yet)
/studio/[[...tool]]  — Sanity Studio embedded via Next.js App Router route
```

### `/work/[slug]` placeholder behavior
- `generateStaticParams` returns `[]` — no pages are pre-rendered
- `export const dynamicParams = false` — any request to `/work/anything` returns a 404 rather than attempting a server render
- Portfolio cards include a `caseStudy` reference field; when populated, the card links to `/work/[slug]`; otherwise it opens the lightbox

### Page sections (in order)
1. Preloader
2. Navbar
3. Hero
4. Marquee
5. Portfolio (horizontal scroll)
6. Pull Quote
7. About
8. Contact + Footer

---

## Sections

### 1. Preloader
A full-screen overlay shown on the first page load of the session.

- Background: `--color-bg`
- Center: "G. GAMARGO" in Cormorant Garamond, letter-spaced, fades in over 0.6s
- After 1.2s total: overlay slides up via `translateY` to reveal the hero beneath
- GSAP timeline drives the entire sequence: fade in logo → pause → slide overlay away → trigger hero entrance
- `sessionStorage` flag (`preloader_seen`) prevents replay on navigation within the session
- The hero entrance animations (eyebrow, name, tagline, stats, CTA) begin only after the preloader exits — GSAP timeline callback chains them

### 2. Navbar
Unchanged from current — fixed top bar with logo, theme toggle (moon/sun), hamburger. Full-screen overlay nav slides down on open with large italic links. Framer Motion AnimatePresence handles the overlay — no change needed.

### 3. Hero
All entrance animations fire via GSAP after the preloader exits (chained in the GSAP timeline).

- **Eyebrow** "Fashion Designer": stagger character reveal, each char `opacity 0→1, y 10→0`
- **H1** "Gaby": word spans slide up from behind a clip-path mask (`clipPath: inset(100% 0 0 0)` → `inset(0% 0 0 0)`)
- **Tagline**: `opacity 0→1, y 20→0`
- **Stats bar**: stagger `opacity 0→1` across 4 items
- **CTA button**: `opacity 0→1, y 10→0`, last in sequence
- **Parallax on scroll**: GSAP ScrollTrigger scrub — "Gaby" moves at 0.3x scroll speed, tagline/stats/CTA at 0.6x, all fade to 0 opacity by 40% of scroll distance to the next section

### 4. Marquee
CSS `@keyframes` animation — unchanged. No GSAP needed.

### 5. Portfolio (horizontal scroll)
- GSAP ScrollTrigger `pin: true` on the outer section
- Inner flex row (`display: flex`) translates X from `0` to `-(N-1) * 100vw` as the user scrolls through `N * 100vh` of scroll distance
- `scrub: 1` for smooth tracking
- **`ScrollTrigger.refresh()`** is called once after all `next/image` images in the portfolio fire their `onLoad` callback, ensuring pin calculations are correct after image dimensions are known
- 4 panels (one per category), each `100vw` wide
- Within each panel: category number + title + subtitle header, then asymmetric card grid
- **Card layout**: items sorted by `order` field; the first item (lowest `order`) always gets `col-span-2` in the 3-column grid — no `featured` boolean needed (order determines layout)
- 3D card tilt on hover: existing mouse-tracking JS, unchanged
- Progress bar: thin `2px` accent line at bottom of sticky container, `scaleX` driven by ScrollTrigger `onUpdate` progress value
- **Mobile** (`< 768px`): ScrollTrigger pin is not created; vertical stack renders instead (same PortfolioCategory component as current)
- **iOS note**: `ScrollTrigger.normalizeScroll(true)` is called in the GSAPProvider to prevent iOS Safari momentum scroll from breaking the pin
- Lightbox: Framer Motion AnimatePresence overlay, unchanged
- Content: fetched from Sanity at build time in a Server Component, passed as props

### 6. Pull Quote
- The quote string is split into word `<span>` elements by the `splitWords` utility at render time
- GSAP ScrollTrigger with `scrub: true` drives each word's `opacity` from `0.1` to `1` as the section scrolls through the viewport
- Each word's trigger range is its proportional slice of `[0, 1]` scroll progress
- Quote text from Sanity `siteSettings.pullQuote` (plain string)

### 7. About
- Two-column layout: text left, image right
- **Text column**: GSAP ScrollTrigger `opacity 0→1, x -24→0` on enter
- **Bio intro paragraph**: `siteSettings.bioIntro` (plain string field) — split into words by `splitWords`, ScrollTrigger scrub word-by-word reveal (faster scrub range than pull quote)
- **Bio body**: `siteSettings.bio` (Portable Text) — rendered via `@portabletext/react`, standard fade-in (no word split — Portable Text renders to DOM elements that can't be pre-split at build time)
- **Image column**: `opacity 0→1, scale 1.05→1.0` on enter
- About image from Sanity `siteSettings.aboutImage`
- Skills tags: hardcoded array in the component (they change rarely and don't need CMS overhead)

### 8. Contact + Footer
- Server Action handles form: validate → send via Resend → return result
- Email destination: `GABY_EMAIL` env var (never exposed to client)
- Fields: Name, Email, Message — inline success/error state, no page reload
- Resume download: `siteSettings.resumePDF` Sanity file asset URL
- Social links: `siteSettings.linkedin`, `siteSettings.instagram`
- Email display: `siteSettings.email`
- Footer: "© [year] Gabriela Gamargo" — year auto-generated

---

## Sanity Schema

### `portfolioCategory`
```
title        string   required
subtitle     string
order        number   required (determines panel order in horizontal scroll)
slug         slug     required (used by portfolioItem → caseStudy link)
```

### `portfolioItem`
```
title        string    required
slug         slug      required (used for /work/[slug] route when caseStudy exists)
category     reference → portfolioCategory   required
image        image     required (with alt text field)
order        number    required (lowest order = featured/col-span-2 card in panel)
caseStudy    reference → caseStudy   optional (when set, card links to /work/[slug])
```

### `caseStudy` (placeholder schema — no content yet)
```
title        string
slug         slug     required
category     reference → portfolioCategory
coverImage   image
content      array[block]  (Portable Text)
```

### `siteSettings` (singleton document)
```
tagline      string         (hero eyebrow tagline)
bioIntro     string         (first bio paragraph — plain string, used for word reveal)
bio          array[block]   (remaining bio — Portable Text)
pullQuote    string         (the pull quote section text)
email        string         (displayed in contact + used as mailto)
linkedin     url
instagram    url
resumePDF    file
aboutImage   image
```

---

## Animation Architecture

### GSAPProvider
A `'use client'` component that wraps the app in `app/layout.tsx`. On mount:
1. Imports GSAP and ScrollTrigger dynamically: `const { gsap } = await import('gsap')` — ensures no SSR breakage since GSAP accesses `window`
2. Registers plugins: `gsap.registerPlugin(ScrollTrigger)`
3. Calls `ScrollTrigger.normalizeScroll(true)` for iOS Safari compatibility
4. Exports a `useGSAP` hook that components use to get the GSAP instance after it's loaded

### Per-component pattern
Each animated component:
- Is a `'use client'` component
- Uses `useEffect` to create ScrollTrigger instances (never at module level)
- Returns a cleanup function: `() => scrollTriggerInstance.kill()`
- Imports GSAP via the `useGSAP` hook (guarantees it's loaded and registered)

### `splitWords` utility
```ts
// src/lib/splitWords.ts
// Splits a string into an array of word strings.
// Components render these as individual <span> elements that GSAP animates.
export function splitWords(text: string): string[] {
  return text.split(' ').filter(Boolean)
}
```
The component maps over the array and renders `<span key={i}>{word}&nbsp;</span>`, giving GSAP direct DOM targets via a ref array.

### ScrollTrigger.refresh() after images load
The Portfolio component tracks how many `next/image` `onLoad` callbacks have fired. When all images in the current panel are loaded, it calls `ScrollTrigger.refresh()` to recalculate pin heights. This prevents the horizontal scroll from miscalculating due to unknown image dimensions at ScrollTrigger creation time.

### Framer Motion stays for
- Full-screen nav overlay (AnimatePresence)
- Lightbox (AnimatePresence)
- Theme selector button
- Preloader exit transition (GSAP preferred, but FM acceptable)

---

## Image Handling

All images use `next/image`:
- Sanity images: URL built with `@sanity/image-url`, passed as `src` to `next/image`
- `placeholder="blur"` with `blurDataURL` from Sanity LQIP (`?w=20&blur=10`)
- Portfolio cards: `sizes="(max-width: 768px) 100vw, 33vw"`
- About image: `sizes="(max-width: 768px) 100vw, 50vw"`
- Add `sanity.io` to `next.config` `images.remotePatterns`

---

## Contact Form

```
Server Action: src/app/actions/sendEmail.ts
  'use server'
  → zod validate: name (string), email (email), message (string min 10)
  → Resend.emails.send({ from, to: process.env.GABY_EMAIL, subject, html })
  → return { success: true } | { error: string }
```

**Environment variables** (set in Vercel dashboard + `.env.local`):
- `RESEND_API_KEY`
- `GABY_EMAIL`

---

## Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'
// Add <Analytics /> inside the root layout — zero further config
```

---

## Sanity Studio

Embedded in the Next.js app using the official Next.js Studio route:
```
app/studio/[[...tool]]/page.tsx
```
Uses `'use client'` + `NextStudio` from `next-sanity/studio`. Accessible at `yourdomain.com/studio`. No separate Sanity deployment needed. Protected by Sanity's own auth — only Sanity project members can log in.

---

## Migration Strategy

1. **Prepare the repo**: delete `vite.config.ts`, `index.html`, `src/main.jsx`. Keep all component files and `src/index.css`.
2. **Scaffold Next.js**: run `npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git --eslint --no-turbopack --import-alias "@/*"` in the project directory (the existing git history is preserved since `--no-git` skips re-init; the extra flags make the scaffold fully non-interactive).
3. **Port components**: copy existing components into `src/components/`. Adjust imports (no `.jsx` extensions needed in Next.js with TypeScript).
4. **Swap color system**: replace Catppuccin CSS vars in `src/app/globals.css` with the new dark/light palette. Update `ThemeContext` to two themes.
5. **Add GSAPProvider**: create `src/components/GSAPProvider.tsx`, wrap in `app/layout.tsx`.
6. **Replace FM scroll logic with GSAP**: component by component — Hero parallax, Portfolio horizontal scroll, PullQuote word reveal, About word reveal.
7. **Set up Sanity**: `npm create sanity@latest` (in a `sanity/` subdirectory for schema), configure `sanity.config.ts`, add Studio route. Note: the `sanity/` subdirectory gets its own `package.json` — run `npm install` inside it separately. Then deploy schema.
8. **Connect content**: create `src/lib/sanity.ts` (client + fetch helper), replace hardcoded content with Sanity queries in Server Components.
9. **Add preloader**: new `src/components/Preloader.tsx`, integrate with Hero GSAP timeline.
10. **Add Server Action + Resend**: `src/app/actions/sendEmail.ts`, update Contact component.
11. **Add Vercel Analytics**: one import in `app/layout.tsx`.
12. **Test build**: `npm run build` — fix any SSR issues. Push to GitHub, verify Vercel deployment.

---

## What Gets Removed

- **Lenis** — already removed from `main.jsx` in the current branch. `lenis` package should be uninstalled (`npm uninstall lenis`). GSAP ScrollTrigger with `normalizeScroll(true)` handles smooth scroll behavior natively.
- **Catppuccin theme system** — all 4 Catppuccin flavors replaced by the two-theme dark/light palette above.
- **Framer Motion scroll hooks** (`useScroll`, `useTransform`, `useVelocity`) — replaced by GSAP ScrollTrigger. Framer Motion stays only for UI state animations.

---

## What Does NOT Change

- Component names and structure
- Film grain overlay (CSS only)
- Custom cursor
- Asymmetric portfolio grid layout
- 3D card tilt on hover
- Full-screen hamburger nav
- Back-to-top button
- Marquee strip
- Overall section order
- Vercel project + GitHub repo

---

## Out of Scope

- Case study page content (placeholder route + schema only)
- Password protection
- Multi-language support
- Blog / editorial section
