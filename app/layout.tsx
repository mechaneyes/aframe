"use client";

import LayoutClient from "./layoutClient.jsx";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
