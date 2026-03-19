// src/app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gabriela Gamargo — Fashion Designer',
  description: 'Fashion designer specializing in resort, bridal, and womenswear. Based in Miami.',
  openGraph: {
    title: 'Gabriela Gamargo — Fashion Designer',
    description: 'Fashion designer specializing in resort, bridal, and womenswear. Based in Miami.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
