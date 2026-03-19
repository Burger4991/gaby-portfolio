# Gaby Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive fashion designer portfolio website for Gaby using React + Vite + Tailwind CSS + Framer Motion.

**Architecture:** Single-page app with five scroll sections (Navbar, Hero, Portfolio, About, Contact). Portfolio content is data-driven via `src/data/portfolioData.js` — no JSX edits required to add new pieces. All animations use Framer Motion and respect `prefers-reduced-motion`.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4 (Vite plugin), Framer Motion, Lucide React, Formspree (contact form)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/portfolioData.js` | Create | All portfolio content — categories, items, metadata |
| `src/components/Navbar.jsx` | Replace | Sticky nav, logo, links, backdrop blur |
| `src/components/Hero.jsx` | Replace | Full-screen intro, name, tagline, CTA |
| `src/components/PortfolioCard.jsx` | Create | Single image card with hover overlay |
| `src/components/PortfolioCategory.jsx` | Create | Section label + responsive grid of cards |
| `src/components/Portfolio.jsx` | Replace | Renders all categories from portfolioData |
| `src/components/About.jsx` | Replace | Two-column bio + image, stacks on mobile |
| `src/components/Contact.jsx` | Replace | Email CTA, resume download, social icons, Formspree form |
| `src/App.jsx` | Keep | Already wired — no changes needed |
| `src/index.css` | Keep | Design tokens already set — no changes needed |
| `public/images/` | Populate | Placeholder images for dev (real images dropped in later) |
| `public/resume.pdf` | Add | Placeholder PDF so download link doesn't 404 |

---

## Verification Protocol

This is a UI-only project — there are no unit tests. Each task is verified by:

1. **Build check:** `npm run build` must exit 0 with no errors
2. **Visual check:** `npm run dev` → open `http://localhost:5173` and confirm the section renders correctly

Run both after every task before committing.

---

## Task 1: Data Layer

**Files:**
- Create: `src/data/portfolioData.js`

- [ ] **Step 1: Create `src/data/` directory and data file**

```bash
mkdir -p src/data
```

Then create `src/data/portfolioData.js`:

```js
// src/data/portfolioData.js
export const categories = [
  {
    id: 'resort',
    label: 'Resort & Beach',
    subtitle: 'Warm weather collections from her last position',
    items: [
      { id: 'r1', src: '/images/placeholder-01.jpg', title: 'Linen Co-ord Set', alt: 'White linen co-ordinate set on model at beach' },
      { id: 'r2', src: '/images/placeholder-02.jpg', title: 'Halter Maxi Dress', alt: 'Terracotta halter maxi dress styled for resort' },
      { id: 'r3', src: '/images/placeholder-03.jpg', title: 'Wrap Coverup', alt: 'Sheer wrap coverup over swimwear' },
    ],
  },
  {
    id: 'sketches',
    label: 'Sketches',
    subtitle: 'Hand-drawn fashion illustrations and design flats',
    items: [
      { id: 's1', src: '/images/placeholder-04.jpg', title: 'Evening Gown Study', alt: 'Hand-drawn sketch of an evening gown with draping detail' },
      { id: 's2', src: '/images/placeholder-05.jpg', title: 'Structured Blazer Flat', alt: 'Design flat of structured double-breasted blazer' },
    ],
  },
  {
    id: 'streetwear',
    label: 'Streetwear',
    subtitle: 'Urban-influenced everyday pieces',
    items: [
      { id: 'sw1', src: '/images/placeholder-06.jpg', title: 'Cargo Trousers', alt: 'Wide-leg cargo trousers in olive green' },
      { id: 'sw2', src: '/images/placeholder-07.jpg', title: 'Oversized Bomber', alt: 'Quilted oversized bomber jacket' },
    ],
  },
  {
    id: 'sustainable',
    label: 'Sustainable',
    subtitle: 'Ethically made, consciously designed',
    items: [
      { id: 'su1', src: '/images/placeholder-08.jpg', title: 'Deadstock Linen Shirt', alt: 'Boxy linen shirt made from deadstock fabric' },
      { id: 'su2', src: '/images/placeholder-09.jpg', title: 'Upcycled Denim Set', alt: 'Two-piece set constructed from upcycled denim' },
    ],
  },
]
```

- [ ] **Step 2: Create `public/images/` directory and add placeholder images**

```bash
mkdir -p public/images
for i in $(seq -w 1 9); do
  curl -s "https://placehold.co/800x1000/E8D5C4/78716C?text=Piece+$i" \
    -o "public/images/placeholder-0$i.jpg" 2>/dev/null || \
  echo "placeholder-0$i" > "public/images/placeholder-0$i.jpg"
done
```

If curl is unavailable, just create empty files — the `<img>` will show a broken image icon, which is fine for development:

```bash
mkdir -p public/images
touch public/images/placeholder-01.jpg public/images/placeholder-02.jpg \
  public/images/placeholder-03.jpg public/images/placeholder-04.jpg \
  public/images/placeholder-05.jpg public/images/placeholder-06.jpg \
  public/images/placeholder-07.jpg public/images/placeholder-08.jpg \
  public/images/placeholder-09.jpg
```

- [ ] **Step 3: Add placeholder resume**

```bash
echo "placeholder" > public/resume.pdf
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: `✓ built in Xms` with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/portfolioData.js public/images/ public/resume.pdf
git commit -m "feat: add portfolio data layer and placeholder assets"
```

---

## Task 2: Navbar

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Replace the placeholder with the full Navbar**

```jsx
// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#E8D5C4]/50">
      <a
        href="#hero"
        className="font-['Cormorant_Garamond'] text-xl font-semibold tracking-[0.2em] text-[#1C1917] hover:text-[#C4704A] transition-colors duration-200 cursor-pointer"
        aria-label="Gaby — back to top"
      >
        GABY
      </a>
      <div className="flex gap-6 md:gap-10 text-xs font-semibold tracking-[0.15em] uppercase text-[#78716C]">
        <a href="#portfolio" className="hover:text-[#C4704A] transition-colors duration-200 cursor-pointer">Work</a>
        <a href="#about"     className="hover:text-[#C4704A] transition-colors duration-200 cursor-pointer">About</a>
        <a href="#contact"   className="hover:text-[#C4704A] transition-colors duration-200 cursor-pointer">Contact</a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Build + visual check**

```bash
npm run build && npm run dev
```

Expected: sticky nav visible at top, links readable at 375px, terracotta hover on links.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: implement Navbar with sticky blur and terracotta hover"
```

---

## Task 3: Hero

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Replace placeholder with full Hero**

```jsx
// src/components/Hero.jsx
import { motion, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const prefersReduced = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.8, ease: 'easeOut', delay: prefersReduced ? 0 : delay },
    }),
  }

  // heroImg: set to a root-relative path like '/images/hero.jpg' once available.
  // Leave as null to use the cream fallback.
  const heroImg = null

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 bg-[#FAF7F2]"
      style={heroImg ? { backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Dark overlay — only rendered when a hero image is present */}
      {heroImg && <div className="absolute inset-0 bg-[#1C1917]/50" aria-hidden="true" />}

      <div className="relative text-center max-w-2xl mx-auto">
        <motion.p
          className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C4704A] mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Fashion Designer
        </motion.p>

        <motion.h1
          className={`font-['Cormorant_Garamond'] text-8xl md:text-[10rem] font-light leading-none mb-6 ${heroImg ? 'text-white' : 'text-[#1C1917]'}`}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
        >
          Gaby
        </motion.h1>

        <motion.p
          className={`text-lg md:text-xl leading-relaxed mb-10 ${heroImg ? 'text-white/80' : 'text-[#78716C]'}`}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          Resort wear, hand-drawn sketches, and everything in between.
        </motion.p>

        <motion.a
          href="#portfolio"
          className="inline-block px-10 py-3.5 border border-[#C4704A] text-[#C4704A] text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#C4704A] hover:text-white transition-colors duration-300 cursor-pointer"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
        >
          View Work
        </motion.a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Build + visual check**

```bash
npm run build && npm run dev
```

Expected: full-screen centered section, large "Gaby" heading, staggered fade-in animation on load, outlined CTA button.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: implement Hero with Framer Motion staggered entrance"
```

---

## Task 4: PortfolioCard

**Files:**
- Create: `src/components/PortfolioCard.jsx`

- [ ] **Step 1: Create the component**

```jsx
// src/components/PortfolioCard.jsx
import { useState } from 'react'

export default function PortfolioCard({ src, title, alt, category }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden bg-[#E8D5C4] aspect-[3/4] cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-[#1C1917]/60 flex flex-col items-center justify-center transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      >
        <p className="font-['Cormorant_Garamond'] text-white text-xl font-light tracking-wide text-center px-4">
          {title}
        </p>
        {category && (
          <p className="text-[#E8D5C4] text-xs tracking-[0.2em] uppercase mt-2">
            {category}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check** (component isn't rendered yet — just confirm no compile error)

```bash
npm run build
```

Expected: `✓ built` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PortfolioCard.jsx
git commit -m "feat: add PortfolioCard with hover overlay"
```

---

## Task 5: PortfolioCategory

**Files:**
- Create: `src/components/PortfolioCategory.jsx`

- [ ] **Step 1: Create the component**

```jsx
// src/components/PortfolioCategory.jsx
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import PortfolioCard from './PortfolioCard'

export default function PortfolioCategory({ label, subtitle, items }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <div ref={ref} className="mb-20">
      {/* Section header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: prefersReduced ? 0 : 0.6, ease: 'easeOut' }}
      >
        <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-light text-[#1C1917] mb-2">
          {label}
        </h3>
        {subtitle && (
          <p className="text-[#78716C] text-sm tracking-wide">{subtitle}</p>
        )}
        <div className="mt-4 w-12 h-px bg-[#C4704A]" />
      </motion.div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: prefersReduced ? 0 : 0.5, ease: 'easeOut', delay: prefersReduced ? 0 : i * 0.1 }}
          >
            <PortfolioCard
              src={item.src}
              title={item.title}
              alt={item.alt}
              category={label}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: `✓ built` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PortfolioCategory.jsx
git commit -m "feat: add PortfolioCategory with scroll entrance animation"
```

---

## Task 6: Portfolio Section

**Files:**
- Modify: `src/components/Portfolio.jsx`

- [ ] **Step 1: Replace placeholder with full Portfolio**

```jsx
// src/components/Portfolio.jsx
import { categories } from '../data/portfolioData'
import PortfolioCategory from './PortfolioCategory'

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
      <div className="mb-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C4704A] mb-4">
          Selected Work
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-[#1C1917]">
          Collections
        </h2>
      </div>

      {categories.map((cat) => (
        <PortfolioCategory
          key={cat.id}
          label={cat.label}
          subtitle={cat.subtitle}
          items={cat.items}
        />
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Build + visual check**

```bash
npm run build && npm run dev
```

Expected: four category sections visible when scrolling past hero, each with header + grid of cards (placeholder images or broken-image icons), hover overlay working on cards.

- [ ] **Step 3: Commit**

```bash
git add src/components/Portfolio.jsx
git commit -m "feat: implement Portfolio section with data-driven categories"
```

---

## Task 7: About Section

**Files:**
- Modify: `src/components/About.jsx`

- [ ] **Step 1: Replace placeholder with full About**

```jsx
// src/components/About.jsx
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <section id="about" className="py-24 px-6 md:px-10 bg-[#E8D5C4]/40">
      <div ref={ref} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, x: prefersReduced ? 0 : -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut' }}
        >
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C4704A] mb-4">
            About
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-[#1C1917] mb-6 leading-tight">
            Gaby
          </h2>
          <p className="text-[#78716C] leading-relaxed text-base md:text-lg mb-6">
            {/* Replace with real bio */}
            Gaby is a fashion designer with experience in resort and beach wear,
            bringing a warm, intentional aesthetic to every collection. Her work
            spans hand-drawn concept sketches to finished garments, always rooted
            in wearability and craft.
          </p>
          <p className="text-[#78716C] leading-relaxed text-base md:text-lg">
            {/* Replace with real philosophy */}
            She believes fashion should feel as good as it looks — and that the
            best designs start with a pencil and a blank page.
          </p>
        </motion.div>

        {/* Image column */}
        <motion.div
          className="aspect-[4/5] bg-[#E8D5C4] overflow-hidden"
          initial={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut', delay: prefersReduced ? 0 : 0.15 }}
        >
          {/* Replace src with a real process shot or portrait */}
          <img
            src="/images/about-placeholder.jpg"
            alt="Gaby at work — process shot"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </motion.div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Build + visual check**

```bash
npm run build && npm run dev
```

Expected: blush-tinted section with two columns on desktop, stacks on mobile. Image column shows blush background when no image is provided (graceful fallback via `onError`).

- [ ] **Step 3: Commit**

```bash
git add src/components/About.jsx
git commit -m "feat: implement About section with two-column layout and scroll animation"
```

---

## Task 8: Contact Section

**Files:**
- Modify: `src/components/Contact.jsx`

**Important — Formspree setup (do this before or after building):**
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — Formspree gives you an endpoint URL like `https://formspree.io/f/xyzabc`
3. Replace `YOUR_FORMSPREE_ID` in the component below with that ID

- [ ] **Step 1: Replace placeholder with full Contact**

```jsx
// src/components/Contact.jsx
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Linkedin, Instagram } from 'lucide-react'

const FORMSPREE_ID = 'YOUR_FORMSPREE_ID' // replace with real ID from formspree.io

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <section id="contact" className="py-24 px-6 md:px-10 bg-[#FAF7F2]">
      <motion.div
        ref={ref}
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut' }}
      >
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C4704A] mb-4">
          Get in Touch
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-[#1C1917] mb-4">
          Let's Work Together
        </h2>
        <p className="text-[#78716C] mb-10 leading-relaxed">
          Open to collaborations, commissions, and new opportunities.
        </p>

        {/* Primary CTA + Resume */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="mailto:gaby@example.com"
            className="px-8 py-3.5 bg-[#C4704A] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#a85c39] transition-colors duration-300 cursor-pointer"
          >
            Say Hello
          </a>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 border border-[#C4704A] text-[#C4704A] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C4704A] hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Download Resume
          </a>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 mb-14">
          <a
            href="https://linkedin.com/in/gaby"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gaby on LinkedIn"
            className="w-11 h-11 flex items-center justify-center text-[#78716C] hover:text-[#C4704A] transition-colors duration-200 cursor-pointer"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://instagram.com/gaby"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gaby on Instagram"
            className="w-11 h-11 flex items-center justify-center text-[#78716C] hover:text-[#C4704A] transition-colors duration-200 cursor-pointer"
          >
            <Instagram size={20} />
          </a>
        </div>

        {/* Contact form */}
        <form
          action={`https://formspree.io/f/${FORMSPREE_ID}`}
          method="POST"
          className="text-left space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-xs font-semibold tracking-[0.15em] uppercase text-[#78716C] mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-white border border-[#E8D5C4] text-[#1C1917] placeholder-[#78716C]/50 focus:outline-none focus:ring-2 focus:ring-[#C4704A] focus:border-transparent transition-shadow duration-200"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold tracking-[0.15em] uppercase text-[#78716C] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-white border border-[#E8D5C4] text-[#1C1917] placeholder-[#78716C]/50 focus:outline-none focus:ring-2 focus:ring-[#C4704A] focus:border-transparent transition-shadow duration-200"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold tracking-[0.15em] uppercase text-[#78716C] mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[#E8D5C4] text-[#1C1917] placeholder-[#78716C]/50 focus:outline-none focus:ring-2 focus:ring-[#C4704A] focus:border-transparent transition-shadow duration-200 resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#C4704A] text-white text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#a85c39] transition-colors duration-300 cursor-pointer"
          >
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p className="mt-16 text-[#78716C]/60 text-xs tracking-wide">
          © {new Date().getFullYear()} Gaby. All rights reserved.
        </p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Update the email and social URLs**

In `Contact.jsx`, replace:
- `gaby@example.com` → her real email
- `https://linkedin.com/in/gaby` → her real LinkedIn URL
- `https://instagram.com/gaby` → her real Instagram handle

- [ ] **Step 3: Build + visual check**

```bash
npm run build && npm run dev
```

Expected: CTA buttons side by side, LinkedIn + Instagram icons with 44px tap targets, form with labeled fields and terracotta focus ring.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.jsx
git commit -m "feat: implement Contact section with form, resume download, and social links"
```

---

## Task 9: Final QA

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: clean build, 0 errors, 0 warnings about missing modules.

- [ ] **Step 2: Start dev server and check each breakpoint**

```bash
npm run dev
```

Open `http://localhost:5173` in browser. Use DevTools to check each breakpoint:

| Width | Check |
|-------|-------|
| 375px | Navbar links fit inline, hero text readable, portfolio grid single-column, about stacked |
| 768px | Portfolio 2-column grid, about side-by-side |
| 1024px | Portfolio 3-column grid |
| 1440px | Content stays within `max-w-6xl`, centered |

- [ ] **Step 3: Check scroll animations**

Scroll through the full page. Verify:
- Hero elements fade up on load (staggered)
- Portfolio categories + cards animate in as they enter viewport
- About columns slide in from sides
- Contact section fades up

- [ ] **Step 4: Check accessibility basics**

- Tab through the page — focus ring (terracotta) visible on all interactive elements
- All images have `alt` text in `portfolioData.js`
- Form labels are present and connected to inputs

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete Gaby portfolio — all sections implemented and QA'd"
```

---

## Task 10: Deployment (Vercel)

- [ ] **Step 1: Push to GitHub**

Create a new repo on github.com (name: `gaby-portfolio`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gaby-portfolio.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) → "Add New Project"
2. Import the `gaby-portfolio` GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy**

Vercel auto-deploys on every push to `main`. No additional config needed for this stack.

- [ ] **Step 3: Verify live site**

Open the Vercel URL and do a quick smoke check — all sections visible, fonts loading, animations working.

---

## Handoff Notes for Gaby

When Gaby is ready to manage the site herself:

**Adding new portfolio pieces:**
1. Drop the image into `public/images/`
2. Open `src/data/portfolioData.js`
3. Add an entry to the relevant category:
   ```js
   { id: 'unique-id', src: '/images/your-image.jpg', title: 'Piece Name', alt: 'Description of the piece' }
   ```
4. Save, commit, push → Vercel deploys automatically

**Updating bio or contact info:**
- Bio text → `src/components/About.jsx` (clearly marked with comments)
- Email / social links → `src/components/Contact.jsx` (clearly marked)

**Need help?** Open Claude Code in the `gaby-portfolio` folder and describe what you want to change.
