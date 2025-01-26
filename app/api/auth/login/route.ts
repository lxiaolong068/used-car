import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 查找用户，同时获取角色信息
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true
      }
    })

    if (!user) {
      console.log('用户不存在:', username);
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    console.log('数据库中的密码:', user.password);
    console.log('用户输入的密码:', password);

    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password)
    console.log('密码验证结果:', validPassword);
    
    if (!validPassword) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    if (!user.role) {
      console.log('用户没有关联的角色');
      return NextResponse.json(
        { error: '用户角色无效' },
        { status: 401 }
      )
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role.role_key,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // 设置 cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return NextResponse.json({
      id: user.user_id,
      username: user.username,
      role: user.role.role_key,
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
