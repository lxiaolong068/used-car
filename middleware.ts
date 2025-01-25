import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 这些路径不需要验证
const publicPaths = ['/', '/api/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是公开路径，直接放行
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 如果是 API 路由但不是公开路径，检查 token
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      )
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: '登录已过期' },
        { status: 401 }
      )
    }
  }

  // 如果是页面路由但不是公开路径，检查 token 并重定向
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api 路由 (/api/.*)
     * - 静态文件 (/_next/static/.*)
     * - 图片 (.*\\..*$)
     * - favicon.ico (favicon.ico)
     */
    '/((?!api|_next/static|.*\\..*|favicon.ico).*)',
    '/api/:path*',
  ],
}
