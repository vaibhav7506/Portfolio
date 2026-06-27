/* src/app/layout.tsx — FULL REPLACEMENT */
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { NoiseOverlay } from '@/components/ui/NoiseOverlay'
import { Navbar } from '@/components/ui/Navbar'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { DebugOverlay } from '@/components/ui/DebugOverlay'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { ChatWidget } from '@/components/ui/ChatWidget'
const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vaibhav Sharma | AI Agent Infrastructure & Full-Stack Systems Engineer',
  description: 'Vaibhav Sharma — CS engineer (MMMUT 2026). Built LoopOS, SentientWallet, and GitBlamed. AI agent infrastructure, edge computing, full-stack systems.',
  openGraph: {
    title: 'Vaibhav Sharma | AI Systems Engineer',
    description: 'Building autonomous agent infrastructure with guardrails, evaluators, and recovery loops.',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Sharma | AI Systems Engineer',
    images: ['/api/og'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='16' fill='%234DA3FF'/%3E%3Cline x1='50' y1='50' x2='20' y2='20' stroke='%234DA3FF' stroke-width='6'/%3E%3Cline x1='50' y1='50' x2='80' y2='20' stroke='%234DA3FF' stroke-width='6'/%3E%3Cline x1='50' y1='50' x2='50' y2='85' stroke='%234DA3FF' stroke-width='6'/%3E%3Ccircle cx='20' cy='20' r='10' fill='%234DA3FF'/%3E%3Ccircle cx='80' cy='20' r='10' fill='%234DA3FF'/%3E%3Ccircle cx='50' cy='85' r='10' fill='%234DA3FF'/%3E%3C/svg%3E"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans selection:bg-accent/25">
        {/* Skip link — first focusable element, off-screen until tab key */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <NoiseOverlay />
        <Navbar />
        <ScrollProgress />
        <CommandPalette />
        <DebugOverlay />

        {/* id="main-content" is the skip-link target */}
        <main
          id="main-content"
          className="flex-grow pt-[82px] relative z-10"
        >
          {children}
           <ChatWidget /> 
        </main>
      </body>
    </html>
  )
}