# gaby-portfolio Architecture

> CLAUDE.md: [../CLAUDE.md](../CLAUDE.md)

## Routing

**Next.js 15 App Router** — two routes, both static:

- `/` — home page assembled from section components in `src/app/page.tsx`
- `/work/[slug]` — collection detail pages, statically generated from `categories` in `portfolioData.ts` via `generateStaticParams`

## Data Layer

All portfolio content lives in **`src/data/portfolioData.ts`** — the single source of truth. Editing copy, images, sections, or categories means editing this file only. Types exported: `SectionImage`, `CollectionSection`, `PortfolioCategory`.

Image assets live in `public/assets/` organized by category and sub-collection (e.g. `public/assets/resort/stephanie-gottlieb/`).

## Theme System

CSS custom properties on `html[data-theme]` — two themes: `dark` (default, `#0C0C0E` bg) and `light` (warm ivory). Defined in `globals.css`. Theme state is in `src/context/ThemeContext.jsx`, persisted to localStorage under `gaby-portfolio-theme`. Always use `var(--color-*)` tokens rather than hardcoded colors.

Token set: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, `--color-accent`, `--color-accent-hover`, `--color-card-bg`, `--color-overlay`.

## Animation Stack

- **GSAP** — wrapped by `GSAPProvider` (registers ScrollTrigger). Used for scroll-driven effects.
- **Framer Motion** — used in `CollectionCarousel` / `ThreeDCarousel` for the 3D cylindrical drag carousel (`useMotionValue`, `useTransform`, `animate` for inertia).
- CSS animations for `Marquee` (defined in `globals.css`).

## Key Components

- `SplitScrollCollection` — collection detail layout. Left column scrolls through sections; IntersectionObserver tracks active section and updates jump nav.
- `CollectionCarousel` / `ThreeDCarousel` — 3D cylindrical carousel. Drag rotates images around a cylinder; inertia handled via Framer Motion's `animate`. Uses `useRef` for stable callbacks to avoid re-subscription on re-renders.
- `GSAPProvider` — initializes GSAP context; wrap any GSAP scroll animations inside a `useGSAP` hook.
- `CustomCursor` — custom dot + ring cursor, only on `(hover: hover)` pointer devices.
- `Preloader` — full-screen preloader that dismisses on `window.load`.

## Fonts

Cormorant Garamond (editorial headings, serif) + Manrope (UI/body, sans-serif). Loaded via Google Fonts in `globals.css`.

## Styling Approach

Tailwind CSS 4 utility classes plus inline styles using CSS custom property tokens. Component-specific CSS class names are defined in `globals.css` (e.g. `.split-back-nav`, `.animate-marquee`). Avoid adding new global CSS classes; prefer inline styles with token vars or Tailwind utilities.
