'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

type Props = { src?: string; title?: string; alt?: string; onClose: () => void }

export default function Lightbox({ src, title, alt, onClose }: Props) {
  useEffect(() => {
    if (!src) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [src, onClose])

  useEffect(() => {
    document.body.style.overflow = src ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [src])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} onClick={onClose}
        >
          <motion.figure
            className="relative max-w-3xl w-full"
            initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain" />
            {title && (
              <figcaption className="mt-4 text-center text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-overlay-muted)' }}>
                {title}
              </figcaption>
            )}
          </motion.figure>
          <button onClick={onClose} aria-label="Close lightbox"
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center cursor-pointer transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--color-overlay-text)' }}>
            <X size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
