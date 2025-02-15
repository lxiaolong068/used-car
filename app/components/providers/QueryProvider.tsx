'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 全局查询配置
            staleTime: 60 * 1000, // 数据在 60 秒内被认为是新鲜的
            gcTime: 5 * 60 * 1000, // 未使用的数据在 5 分钟后被垃圾回收
            retry: 1, // 失败后重试 1 次
            refetchOnWindowFocus: false, // 窗口获得焦点时不自动重新获取数据
          },
          mutations: {
            // 全局修改配置
            retry: 1, // 失败后重试 1 次
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
} 