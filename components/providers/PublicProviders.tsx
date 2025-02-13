'use client';

import { QueryProvider } from './QueryProvider';
import { ClientErrorBoundary } from '@/lib/errors/ClientErrorBoundary';
import { Toaster } from 'react-hot-toast';

interface Props {
  children: React.ReactNode;
}

export function PublicProviders({ children }: Props) {
  return (
    <QueryProvider>
      <ClientErrorBoundary>
        {children}
        <Toaster />
      </ClientErrorBoundary>
    </QueryProvider>
  );
}
