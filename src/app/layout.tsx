import type { Metadata } from "next";
import "./globals.css";

import localFont from 'next/font/local'

const NerdFont = localFont({
  src: "../fonts/NerdFontMono.ttf",
  variable: "--font-nerd-font-mono"
})

export const metadata: Metadata = {
  title: "PORTFOLIO v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${NerdFont.variable} font-nerd-font-mono antialiased text-ctp-text 
          w-full h-screen p-0.5 box-border
          bg-ctp-base `
        }
      >
        {children}
      </body>
    </html>
  );
}
