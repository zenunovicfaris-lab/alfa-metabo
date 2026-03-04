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
  title: 'Alfa Metabo | 1. Mjesto na Googleu – SEO za PVC Stolariju',
  description: 'Lokalni SEO za Alfa Metabo PVC stolariju u Travniku, BiH. 1. mjesto na Googleu za 90 dana ili povrat novca.',
  icons: {
    icon: '/favicon.ico',
  },
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
