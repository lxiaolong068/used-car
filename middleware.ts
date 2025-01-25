import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// 这些路径不需要验证
const publicPaths = ['/', '/api/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是公开路径，直接放行
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    // 如果是 API 路由，返回 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }
    // 如果是页面路由，重定向到登录页
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    // 验证 token
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    )

    // token 有效，放行请求
    const response = NextResponse.next()

    // 确保 token 在响应中也存在
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    // 如果是 API 路由，返回 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: '登录已过期' },
        { status: 401 }
      )
    }
    // 如果是页面路由，重定向到登录页
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
