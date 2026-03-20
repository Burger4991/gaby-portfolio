// src/app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import GSAPProvider from '@/components/GSAPProvider'
import './globals.css'

const SITE_URL = 'https://gabrielagamargo.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Gabriela Gamargo — Fashion Designer',
  description:
    'Portfolio of Gabriela Gamargo — fashion designer with 10+ years in resort, bridal, and womenswear. Based in Miami.',
  keywords: [
    'fashion designer',
    'resort wear',
    'bridal',
    'womenswear',
    'Miami',
    'FIDM',
    'Pitusa',
    'Gabriela Gamargo',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Gabriela Gamargo — Fashion Designer',
    description:
      'Fashion designer with 10+ years in resort, bridal, and womenswear. Based in Miami.',
    url: SITE_URL,
    siteName: 'Gabriela Gamargo',
    type: 'website',
    images: [
      {
        url: '/assets/hero/7cdfb90c99a3bee5bb6a9b6db8ec3f7a.jpg',
        width: 1200,
        height: 630,
        alt: 'Gabriela Gamargo — Fashion Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gabriela Gamargo — Fashion Designer',
    description:
      'Fashion designer with 10+ years in resort, bridal, and womenswear. Based in Miami.',
    images: ['/assets/hero/7cdfb90c99a3bee5bb6a9b6db8ec3f7a.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <GSAPProvider>
            {children}
          </GSAPProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
