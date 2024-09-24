'use client'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark:bg-black">
        {children}
        <Toaster className="dark:bg-primary-dark" />
      </body>
    </html>
  )
}
