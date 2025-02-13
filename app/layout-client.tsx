'use client'

import { SessionProvider } from "next-auth/react"

export default function RootLayoutClient({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <html lang="zh">
      <body className={className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 