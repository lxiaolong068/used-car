import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as any

    // 检查是否是管理员
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }

    // 获取用户列表
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
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
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as any

    // 检查是否是管理员
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }

    const { username, password, role } = await request.json()

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 8)

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
