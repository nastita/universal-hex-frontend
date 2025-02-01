import "./globals.css"
import { Inter } from "next/font/google"
import Header from "../components/Header"
import MagicalBackground from "../components/MagicalBackground"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Universal HEX",
  description: "A hybrid exchange bridging CEX and DEX",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <MagicalBackground />
        <Header />
        {children}
      </body>
    </html>
  )
}

