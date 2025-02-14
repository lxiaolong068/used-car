import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// 配置需要保护的路径
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/cars/:path*',
    '/api/users/:path*',
  ],
}

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    console.log('Middleware running for path:', path);

    // 验证用户角色
    const token = req.nextauth?.token;
    console.log('Token for protected route:', token);

    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const hasValidRole = token.role === 'admin' || token.role === 'super_admin';
    console.log('Role validation:', { role: token.role, isValid: hasValidRole });

    if (!hasValidRole) {
      console.log('Invalid role, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
)
