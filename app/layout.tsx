import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const metadata = {
  title: 'Third Eyes',
  description: 'Interrogate Pitchfork Reviews via GPT-3.5',
  url: 'https://hearincolor.com',
  siteName: 'Third Eyes',
  openGraph: {
    title: 'Third Eyes',
    description: 'Interrogate Pitchfork Reviews via GPT-3.5',
    url: 'https://hearincolor.com',
    siteName: 'Third Eyes',
    images: [
      {
        url: 'https://hearincolor.com/_next/image?url=%2Fthird-eyes-og.jpg&w=1200&q=75',
        width: 1200,
        height: 630,
        alt: 'ThirdEyes via HearInColor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  )
}
