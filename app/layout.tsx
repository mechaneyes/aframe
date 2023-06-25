import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ThirdEyes',
  description: 'Interrogate Pitchfork Reviews via GPT-3.5',
  openGraph: {
    title: 'ThirdEyes',
    description: 'Interrogate Pitchfork Reviews via GPT-3.5',
    url: 'https://hearincolor.com',
    siteName: 'ThirdEyes',
    images: [
      // {
      //   url: 'https://nextjs.org/og.png',
      //   width: 800,
      //   height: 600,
      // },
      {
        url: 'https://hearincolor.com/_next/image?url=%2Fthird-eyes-og.jpg&w=1200&q=75',
        width: 1200,
        height: 630,
        alt: 'ThirdEyes via HearInColor',
      },
    ],

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
