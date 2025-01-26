import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// 验证管理员权限的辅助函数
async function verifyAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    throw new Error('未登录')
  }

  const decoded = jwt.verify(
    token.value,
    process.env.JWT_SECRET || 'your-secret-key'
  ) as any

  if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
    throw new Error('无权限访问')
  }

  return decoded
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdmin()

    const roleId = params.id
    if (!roleId || isNaN(Number(roleId))) {
      return NextResponse.json(
        { error: '无效的角色ID' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { role_name, role_key, description } = data

    // 检查必要字段
    if (!role_name || !role_key) {
      return NextResponse.json(
        { error: '角色名称和标识不能为空' },
        { status: 400 }
      )
    }

    // 检查角色是否存在
    const existingRole = await prisma.role.findFirst({
      where: {
        role_id: Number(roleId),
        status: 1
      }
    })

    if (!existingRole) {
      return NextResponse.json(
        { error: '角色不存在' },
        { status: 404 }
      )
    }

    // 如果修改了role_key，检查是否与其他角色冲突
    if (role_key !== existingRole.role_key) {
      const duplicateRole = await prisma.role.findFirst({
        where: {
          role_key,
          status: 1,
          NOT: {
            role_id: Number(roleId)
          }
        }
      })

      if (duplicateRole) {
        return NextResponse.json(
          { error: '角色标识已存在' },
          { status: 400 }
        )
      }
    }

    // 更新角色
    const role = await prisma.role.update({
      where: {
        role_id: Number(roleId)
      },
      data: {
        role_name,
        role_key,
        description,
        update_time: new Date()
      }
    })

    return NextResponse.json(role)
  } catch (error: any) {
    console.error('更新角色失败:', error)
    if (error.message === '未登录' || error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: '无效的登录状态' },
        { status: 401 }
      )
    }
    if (error.message === '无权限访问') {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: '更新角色失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdmin()

    const roleId = params.id
    if (!roleId || isNaN(Number(roleId))) {
      return NextResponse.json(
        { error: '无效的角色ID' },
        { status: 400 }
      )
    }

    // 检查角色是否存在
    const existingRole = await prisma.role.findFirst({
      where: {
        role_id: Number(roleId),
        status: 1
      }
    })

    if (!existingRole) {
      return NextResponse.json(
        { error: '角色不存在' },
        { status: 404 }
      )
    }

    // 检查是否是超级管理员角色
    if (existingRole.role_key === 'super_admin') {
      return NextResponse.json(
        { error: '不能删除超级管理员角色' },
        { status: 403 }
      )
    }

    // 软删除角色
    const role = await prisma.role.update({
      where: {
        role_id: Number(roleId)
      },
      data: {
        status: 0,
        update_time: new Date()
      }
    })

    return NextResponse.json(role)
  } catch (error: any) {
    console.error('删除角色失败:', error)
    if (error.message === '未登录' || error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: '无效的登录状态' },
        { status: 401 }
      )
    }
    if (error.message === '无权限访问') {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: '删除角色失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
