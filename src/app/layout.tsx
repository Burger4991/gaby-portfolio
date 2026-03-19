import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  title: 'Gabriela Gamargo — Fashion Portfolio',
  description: 'Fashion design portfolio of Gabriela Gamargo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
