import type { Metadata } from 'next'
import { Outfit, Syne } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SEO Pro BiH - Alfa Metabo',
  description: 'Lokalni SEO specialist za PVC stolariju u Travniku, BiH',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bs" className={`${outfit.variable} ${syne.variable}`}>
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
