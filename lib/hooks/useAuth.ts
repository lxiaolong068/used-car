import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useErrorHandler } from './useErrorHandler';
import { signOut, useSession } from 'next-auth/react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResult {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthResult {
  const { data: session, status } = useSession();
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { handleError } = useErrorHandler();

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error: any) {
      handleError(error);
    }
  }, [router, handleError]);

  const refreshUser = useCallback(async () => {
    // NextAuth.js 会自动刷新会话
  }, []);

  // 将 session.user 转换为我们需要的格式
  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    role: session.user.role || ''
  } : null;

  const result = {
    user,
    loading: status === 'loading',
    error,
    isAuthenticated: !!session,
    logout,
    refreshUser
  };

  console.log('useAuth result:', result);
  return result;
} 