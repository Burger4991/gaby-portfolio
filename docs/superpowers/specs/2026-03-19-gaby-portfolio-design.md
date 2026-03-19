# Gaby Portfolio — Design Spec
**Date:** 2026-03-19
**Status:** Approved

---

## Overview

A fashion designer portfolio website for Gaby. Goals: land a job/internship, attract freelance clients, and showcase creative work. Built with React + Vite + Tailwind CSS + Framer Motion. Managed by Alex initially; Gaby will take over updates over time (likely with Claude Code assistance).

---

## Stack

| Tool | Purpose |
|------|---------|
| React + Vite | Component-based UI, fast dev server |
| Tailwind CSS (v4, Vite plugin) | Utility styling |
| Framer Motion | Scroll animations, hover transitions |
| Lucide React | SVG icons |
| Vercel / Netlify | Free deployment |

---

## Site Architecture

| # | Section | ID | Purpose |
|---|---------|-----|---------|
| 1 | Navbar | — | Fixed top nav — logo + Work / About / Contact links |
| 2 | Hero | `#hero` | Full-screen intro — name, title, hero image, CTA button |
| 3 | Portfolio | `#portfolio` | Grouped sections by category, scroll-through |
| 4 | About | `#about` | Bio, design philosophy, process shots |
| 5 | Contact | `#contact` | Email CTA, resume download, LinkedIn, Instagram, contact form |

---

## Component Structure

```
src/
  components/
    Navbar.jsx       — sticky, backdrop-blur, terracotta hover states
    Hero.jsx         — full-screen, large Cormorant heading, animated entrance
    Portfolio.jsx    — section container; renders PortfolioCategory children
    PortfolioCategory.jsx — labeled group header + masonry/grid of cards
    PortfolioCard.jsx     — image, hover overlay with piece name + category
    About.jsx        — two-column: text left, process image right (stacks on mobile)
    Contact.jsx      — email link, resume download, social icons, contact form
  data/
    portfolioData.js — all portfolio content config
public/
  images/            — all portfolio images drop here (root-relative paths)
```

---

## Portfolio Categories

Scroll-through grouped sections (no filter tabs). Categories:

1. **Resort & Beach** — finished garments, lookbook photos
2. **Sketches** — hand-drawn illustrations, flats
3. **Streetwear** — finished pieces, process shots
4. **Sustainable** — ethical/sustainable pieces

Each category: label + subtitle + 2–4 column responsive grid. Cards show image; hover reveals piece name and category label (300ms fade overlay).

Images stored in `public/images/` (Vite public directory). This means they are referenced by root-relative paths (e.g., `/images/resort-01.jpg`) and do not go through Vite's asset pipeline — making them easy to add/replace without touching any imports. When Gaby adds new work, she drops the image into `public/images/` and adds an entry to `portfolioData.js` — no JSX editing required.

---

## Visual Identity

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FAF7F2` | Page background |
| `charcoal` | `#1C1917` | Primary text, headings |
| `terra` | `#C4704A` | Accent, CTAs, hover states |
| `blush` | `#E8D5C4` | Section backgrounds, highlights |
| `muted` | `#78716C` | Secondary text, nav links |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | Cormorant Garamond | 300–600 |
| Body / UI | Manrope | 300–700 |

### Motion

- **Scroll entrance:** `framer-motion` `fadeInUp` on each section (triggered by viewport intersection)
- **Portfolio cards:** hover fade-in overlay (300ms)
- **Navbar links:** color transition 200ms
- **CTA buttons:** background color transition 300ms
- **Page:** smooth scroll behavior
- **Accessibility:** all animations respect `prefers-reduced-motion`

---

## Hero Section

- Full viewport height (`min-h-screen`)
- Centered layout with top padding for fixed navbar
- Elements (top to bottom):
  - Eyebrow: `"Fashion Designer"` — small caps, terracotta, letter-spaced
  - Name: `"Gaby"` — Cormorant Garamond, very large (7xl–9xl), light weight
  - Tagline: short line about her work
  - CTA button: `"View Work"` → scrolls to `#portfolio` — outlined terracotta style
- Background: warm cream (`#FAF7F2`) by default. When a hero image is available, it renders as a full-bleed background with a subtle dark overlay for text contrast. The cream fallback is the shipped default until an image is provided — components must render correctly without one.

---

## About Section

- Blush (`#E8D5C4`) tinted background to visually separate
- Two-column desktop layout: text left, image right
- Text: name, bio paragraph, design philosophy, optional skills/tools list
- Image: process shot or portrait
- Stacks to single column on mobile

---

## Contact Section

Four elements:

1. **Email CTA** — `"Say Hello"` button → `mailto:` link
2. **Resume download** — button linking to a PDF in `/public/resume.pdf`
3. **Social links** — LinkedIn icon + Instagram icon (Lucide SVG, 44×44px touch targets)
4. **Contact form** — name, email, message fields + submit button
   - Form submission: handled via [Formspree](https://formspree.io) (free tier, no backend required). Alex creates a Formspree account, gets the form endpoint, and drops it into the form action URL.
   - Fields have visible labels, focus states, terracotta focus ring

---

## Responsiveness

| Breakpoint | Layout |
|-----------|--------|
| 375px (mobile) | Single column; navbar simplifies to logo + three inline text links (no hamburger — links are short enough to fit) |
| 768px (tablet) | 2-column portfolio grid, about side-by-side |
| 1024px (desktop) | 3-column portfolio grid |
| 1440px (wide) | Max content width `max-w-6xl`, centered |

---

## Accessibility

- All images have descriptive `alt` text
- Form inputs use `<label>` elements
- Focus states visible on all interactive elements (terracotta ring)
- Color contrast ≥ 4.5:1 for all text
- Icon-only buttons have `aria-label`
- `prefers-reduced-motion` respected globally

---

## Data Management (portfolioData.js)

Portfolio content lives in `src/data/portfolioData.js` — a plain JS array. Gaby (or Claude Code) edits this file to add/remove pieces without touching component JSX.

```js
// Example shape
export const categories = [
  {
    id: 'resort',
    label: 'Resort & Beach',
    subtitle: 'Warm weather collections from her last position',
    items: [
      { id: 1, src: '/images/resort-01.jpg', title: 'Linen Co-ord Set', alt: 'White linen co-ordinate set on model at beach' },
    ]
  },
]
```

---

## Deployment

- Push to GitHub
- Connect repo to Vercel (free tier) — auto-deploys on every push to `main`
- Custom domain can be added later when Gaby has one

---

## Out of Scope (for now)

- CMS / admin dashboard
- E-commerce / shop
- Blog
- Dark mode
- Password-protected client work
