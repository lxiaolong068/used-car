import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// 不需要验证的路径
const publicPaths = ['/login', '/api/auth/login']

// 需要验证的路径
const protectedPaths = ['/dashboard']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是公开路径，直接放行
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 如果不是受保护的路径，也直接放行
  if (!protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 使用 request.cookies 替代 cookies()
  const token = request.cookies.get('token')?.value
  console.log('Token from cookie:', token)

  // 未登录用户访问受保护页面
  if (!token) {
    console.log('No token found, redirecting to login')
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    )
    const { payload } = await jwtVerify(token, secret)
    console.log('JWT payload:', payload)

    // 检查用户角色 (根据您的实际需求修改)
    if (
      payload.role !== 'super_admin' &&
      payload.role !== 'admin'
    ) {
      console.log('User role is not allowed:', payload.role)
      // 如果不是允许的角色，重定向到错误页面或首页
      return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log('User authorized:', {
      id: payload.id,
      role: payload.role
    })

    // 将用户信息添加到请求头 (可选)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.id as string)
    requestHeaders.set('x-user-role', payload.role as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('JWT verification error:', error)
    // JWT 验证失败，重定向到登录页面
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

// 修改 matcher 配置，只匹配需要保护的路径
export const config = {
  matcher: [
    '/dashboard/:path*',  // 匹配仪表盘及其子路径
  ],
}
