import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 验证 token
    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { user_id: number }
    
    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { error: 'Token无效' },
        { status: 401 }
      )
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
      select: {
        user_id: true,
        username: true,
        role: {
          select: {
            role_id: true,
            role_name: true
          }
        }
      }
    })

    if (!user || !user.role) {
      return NextResponse.json(
        { error: '用户不存在或角色无效' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user_id: user.user_id,
      username: user.username,
      role: {
        role_id: user.role.role_id,
        role_name: user.role.role_name
      }
    })
  } catch (error) {
    console.error('Get user info error:', error)
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    )
  }
}
