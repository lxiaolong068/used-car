'use client';

import { QueryProvider } from './QueryProvider';
import { ClientErrorBoundary } from '@/lib/errors/ClientErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

export function ClientProviders({ children }: Props) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ClientErrorBoundary>
          {children}
          <Toaster />
        </ClientErrorBoundary>
      </QueryProvider>
    </SessionProvider>
  );
} 