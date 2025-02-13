'use client'

import { PublicProviders } from '@/components/providers/PublicProviders'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicProviders>
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    </PublicProviders>
  )
}
