'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0} // 禁用自动刷新
      refetchOnWindowFocus={false} // 禁用窗口聚焦时刷新
    >
      {children}
    </SessionProvider>
  );
}
