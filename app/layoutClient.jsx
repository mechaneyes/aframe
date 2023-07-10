"use client";

import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { thirdEyesTheme } from "../themes/thirdEyesTheme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const metadata = {
  title: "Third Eyes",
  description: "Interrogate Pitchfork Reviews via GPT-3.5",
  url: "https://hearincolor.com",
  siteName: "Third Eyes",
  openGraph: {
    title: "Third Eyes",
    description: "Interrogate Pitchfork Reviews via GPT-3.5",
    url: "https://hearincolor.com",
    siteName: "Third Eyes",
    images: [
      {
        url: "https://hearincolor.com/_next/image?url=%2Fthird-eyes-og.jpg&w=1200&q=75",
        width: 1200,
        height: 630,
        alt: "ThirdEyes via HearInColor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function LayoutClient({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="title" content="Third Eyes" />
        <meta
          name="description"
          content="Interrogate Pitchfork Reviews via GPT-3"
        />
        <meta
          name="keywords"
          content="mechaneyes, ai, generative ai, gpt, openai, stability.ai"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Ray Weitzenberg" />
        <meta property="og:title" content="Third Eyes" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hearincolor.com" />
        <meta
          property="og:image"
          content="https://hearincolor.com/_next/image?url=%2Fthird-eyes-og.jpg&w=1200&q=75"
        />
      </Head>
      <ThemeProvider theme={thirdEyesTheme}>
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
      <Analytics />
    </html>
  );
}
