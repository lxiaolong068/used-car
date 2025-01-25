import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 验证用户是否登录
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 验证 token
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any

    // 检查是否是超级管理员或管理员
    if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }

    // 获取角色列表
    const roles = await prisma.role.findMany({
      where: {
        status: 1 // 只获取启用的角色
      },
      select: {
        role_id: true,
        role_name: true,
        role_key: true,
        description: true
      },
      orderBy: {
        role_id: 'asc'
      }
    })

    return NextResponse.json(roles)
  } catch (error: any) {
    console.error('获取角色列表失败:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: '无效的登录状态' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: '获取角色列表失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
