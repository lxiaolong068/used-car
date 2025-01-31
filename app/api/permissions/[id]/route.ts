import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

// 更新权限
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const data = await request.json()
    
    // 使用原始 SQL 更新权限
    await prisma.$executeRaw`
      UPDATE permission 
      SET 
        permission_name = ${data.permission_name},
        permission_key = ${data.permission_key},
        permission_type = ${data.permission_type},
        path = ${data.path},
        icon = ${data.icon},
        sort_order = ${parseInt(data.sort_order)},
        status = ${parseInt(data.status)},
        parent_id = ${data.parent_id || null}
      WHERE permission_id = ${parseInt(params.id)}
    `

    // 获取更新后的权限
    const permission = await prisma.permission.findUnique({
      where: {
        permission_id: parseInt(params.id)
      },
      include: {
        children: true,
        parent: true,
        roles: {
          include: {
            role: true
          }
        }
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
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

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