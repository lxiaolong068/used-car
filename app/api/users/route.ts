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

    // 获取用户列表
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        username: true,
        role: {
          select: {
            role_id: true,
            role_name: true,
            role_key: true
          }
        },
        create_time: true,
      },
      orderBy: {
        create_time: 'desc',
      },
    })

    // 转换响应格式以保持与前端兼容
    const formattedUsers = users.map(user => ({
      user_id: user.user_id,
      username: user.username,
      role: user.role?.role_key || 'user',
      create_time: user.create_time
    }))

    return NextResponse.json(formattedUsers)
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: '无效的登录状态' },
        { status: 401 }
      )
    }
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
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any

    // 检查是否是超级管理员
    if (decoded.role !== 'super_admin') {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }

    const { username, password, role_id } = await request.json()
    
    console.log('添加用户请求数据:', { username, password, role_id })

    // 验证必填字段
    if (!username || !password || !role_id) {
      return NextResponse.json(
        { error: '用户名、密码和角色不能为空' },
        { status: 400 }
      )
    }

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

    // 检查角色是否存在
    const role = await prisma.role.findUnique({
      where: { role_id: role_id },
    })

    console.log('查找到的角色:', role)

    if (!role) {
      return NextResponse.json(
        { error: '指定的角色不存在' },
        { status: 400 }
      )
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 8)
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role_id: role_id,
      },
      select: {
        user_id: true,
        username: true,
        role: {
          select: {
            role_key: true
          }
        },
        create_time: true,
      },
    })

    return NextResponse.json({
      user_id: user.user_id,
      username: user.username,
      role: user.role?.role_key || 'user',
      create_time: user.create_time
    })
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
