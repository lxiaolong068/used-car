import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id)

    // 检查要删除的用户是否存在，同时获取其角色信息
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 如果要删除的用户是超级管理员，则不允许删除
    if (user.role?.role_key === 'super_admin') {
      return NextResponse.json(
        { error: '不能删除超级管理员用户' },
        { status: 403 }
      )
    }

    // 如果当前用户是管理员（非超级管理员），则不能删除其他管理员
    if (decoded.role === 'admin' && user.role?.role_key === 'admin') {
      return NextResponse.json(
        { error: '管理员不能删除其他管理员' },
        { status: 403 }
      )
    }

    // 删除用户
    await prisma.user.delete({
      where: { user_id: id },
    })

    return NextResponse.json({ message: '用户删除成功' })
  } catch (error: any) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id)
    const { username, password, role_id } = await request.json()

    // 检查要修改的用户是否存在
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 如果要修改的用户是超级管理员，且当前用户不是超级管理员，则不允许修改
    if (user.role?.role_key === 'super_admin' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { error: '无权修改超级管理员用户' },
        { status: 403 }
      )
    }

    // 如果当前用户是管理员（非超级管理员），则不能修改其他管理员
    if (decoded.role === 'admin' && user.role?.role_key === 'admin') {
      return NextResponse.json(
        { error: '管理员不能修改其他管理员' },
        { status: 403 }
      )
    }

    // 准备更新数据
    const updateData: any = {
      username,
      role_id: parseInt(role_id.toString())
    }

    // 只有在提供密码时才更新密码
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8)
      updateData.password = hashedPassword
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { user_id: id },
      data: updateData,
      include: {
        role: true
      }
    })

    return NextResponse.json({
      message: '用户更新成功',
      user: {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        role: updatedUser.role?.role_key || 'user'
      }
    })
  } catch (error: any) {
    console.error('更新用户失败:', error)
    return NextResponse.json(
      { error: '更新用户失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
