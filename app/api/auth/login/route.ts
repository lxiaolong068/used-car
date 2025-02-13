import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { username, password, remember } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    // 生成 JWT
    const token = sign(
      {
        id: user.user_id,
        username: user.username,
        role: user.role.role_key,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: remember ? '7d' : '1d',
      }
    )

    // 将 JWT 存储在 Cookie 中
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
      path: '/',
    }

    // 在返回响应之前，先打印一些调试信息
    console.log('Setting cookie with token:', {
      token: token.substring(0, 20) + '...', // 只打印token的前20个字符
      options: cookieOptions
    })

    cookies().set('token', token, cookieOptions)

    return NextResponse.json({
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role.role_key
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    )
  }
}
