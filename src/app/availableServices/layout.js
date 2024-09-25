'use client'

import MobileNavbar from './MobileNavbar'

export default function RootLayout({ children }) {
  return (
    <div>
      <MobileNavbar />
      {children}
    </div>
  )
}
