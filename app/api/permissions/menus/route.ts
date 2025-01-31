import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'
import { Prisma } from '@prisma/client'

type PermissionWithChildren = Prisma.permissionGetPayload<{
  include: {
    children: true
  }
}>

// 递归构建菜单树
function buildMenuTree(permissions: PermissionWithChildren[], parentId: number | null = null): PermissionWithChildren[] {
  return permissions
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      ...item,
      children: buildMenuTree(permissions, item.permission_id)
    }))
}

// 获取菜单列表
export async function GET(request: Request) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取用户的角色和权限
    const userWithPermissions = await prisma.user.findUnique({
      where: {
        user_id: user.user_id
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  include: {
                    children: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!userWithPermissions || !userWithPermissions.role) {
      return NextResponse.json({ error: '用户不存在或未分配角色' }, { status: 404 })
    }

    // 提取用户的所有权限
    const permissions = new Set<PermissionWithChildren>()
    userWithPermissions.role.permissions.forEach(rolePermission => {
      if (rolePermission.permission) {
        permissions.add(rolePermission.permission as PermissionWithChildren)
      }
    })

    // 转换为数组并构建菜单树
    const menuTree = buildMenuTree(Array.from(permissions))

    return NextResponse.json(menuTree)
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    return NextResponse.json({ error: '获取菜单列表失败' }, { status: 500 })
  }
} 