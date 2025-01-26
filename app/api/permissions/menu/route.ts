import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

interface RolePermission {
  permission_id: number
  role_id: number
  permission: {
    permission_id: number
    permission_type: string
    status: number
  }
}

// 验证管理员权限的辅助函数
async function verifyUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    throw new Error('未登录')
  }

  try {
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any
    return decoded
  } catch (error) {
    throw new Error('未登录')
  }
}

export async function GET() {
  try {
    const user = await verifyUser()

    // 获取用户的角色
    const userRole = await prisma.user.findUnique({
      where: {
        user_id: user.user_id
      },
      include: {
        role: true
      }
    })

    if (!userRole || !userRole.role) {
      return NextResponse.json(
        { error: '用户角色不存在' },
        { status: 403 }
      )
    }

    // 获取角色的权限
    const rolePermissions = await prisma.role_permission.findMany({
      where: {
        role_id: userRole.role.role_id
      },
      include: {
        permission: true
      }
    })

    // 如果没有任何权限，返回空数组而不是错误
    if (!rolePermissions.length) {
      return NextResponse.json([])
    }

    // 获取所有菜单类型的权限ID
    const permissionIds = rolePermissions
      .filter((rp: RolePermission) => rp.permission.permission_type === 'menu' && rp.permission.status === 1)
      .map((rp: RolePermission) => rp.permission_id)

    // 如果没有菜单权限，返回空数组
    if (!permissionIds.length) {
      return NextResponse.json([])
    }

    // 获取所有菜单权限
    const permissions = await prisma.permission.findMany({
      where: {
        permission_id: {
          in: permissionIds
        },
        permission_type: 'menu',
        status: 1
      },
      orderBy: {
        sort_order: 'asc'
      }
    })

    // 将权限列表转换为树形结构
    const buildPermissionTree = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildPermissionTree(items, item.permission_id)
        }))
        .sort((a, b) => a.sort_order - b.sort_order)
    }

    const menuTree = buildPermissionTree(permissions)

    return NextResponse.json(menuTree)
  } catch (error: any) {
    console.error('获取菜单失败:', error)
    if (error.message === '未登录') {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: '获取菜单失败' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
