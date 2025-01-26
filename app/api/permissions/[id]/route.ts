import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 更新权限
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const permission = await prisma.permission.update({
      where: {
        permission_id: parseInt(params.id)
      },
      data: {
        parent_id: data.parent_id,
        permission_name: data.permission_name,
        permission_key: data.permission_key,
        permission_type: data.permission_type,
        path: data.path,
        component: data.component,
        icon: data.icon,
        sort_order: data.sort_order,
        status: data.status
      }
    })
    return NextResponse.json(permission)
  } catch (error) {
    console.error('更新权限失败:', error)
    return NextResponse.json(
      { error: '更新权限失败' },
      { status: 500 }
    )
  }
}

// 删除权限
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 检查是否有子权限
    const childPermissions = await prisma.permission.findMany({
      where: {
        parent_id: parseInt(params.id)
      }
    })

    if (childPermissions.length > 0) {
      return NextResponse.json(
        { error: '该权限下有子权限，无法删除' },
        { status: 400 }
      )
    }

    // 检查是否有角色关联
    const rolePermissions = await prisma.role_permission.findMany({
      where: {
        permission_id: parseInt(params.id)
      }
    })

    if (rolePermissions.length > 0) {
      return NextResponse.json(
        { error: '该权限已被角色使用，无法删除' },
        { status: 400 }
      )
    }

    await prisma.permission.delete({
      where: {
        permission_id: parseInt(params.id)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除权限失败:', error)
    return NextResponse.json(
      { error: '删除权限失败' },
      { status: 500 }
    )
  }
} 