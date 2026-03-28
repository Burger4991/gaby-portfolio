'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-40 w-11 h-11 flex items-center justify-center cursor-pointer"
          style={{
            borderRadius: '8px',
            border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
            background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
            backdropFilter: 'blur(12px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
            color: 'var(--color-accent)',
            boxShadow: 'inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent), 0 0 12px 0 color-mix(in srgb, var(--color-accent) 10%, transparent)',
          }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
