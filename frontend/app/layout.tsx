"use client"

import "./globals.css"
import { useEffect } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => {
          console.log("Service Worker Registered")
        })
        .catch((err) => {
          console.log("SW Error:", err)
        })
    }
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}