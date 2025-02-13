'use client'

import { ClientProviders } from '@/components/providers/ClientProviders'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  )
}
