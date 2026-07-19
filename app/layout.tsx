import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

export const metadata: Metadata = {
  title: 'StadiumVerse AI — FIFA World Cup 2026',
  description: 'One AI Platform. Every Fan. Every Match. Every Second.',
  manifest: '/manifest.json',
}
export const viewport: Viewport = { themeColor: '#0d0e1a' }

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
