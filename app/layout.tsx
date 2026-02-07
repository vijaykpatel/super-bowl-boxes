import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'Super Bowl Squares - Seahawks vs Patriots',
  description: 'Pick your squares and win big! Super Bowl Squares game for Seahawks vs Patriots.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f1724',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
