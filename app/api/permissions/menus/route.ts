import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'
import type { permission } from '@prisma/client'

interface RawPermission {
  permission_id: string
  parent_id: string | null
  permission_name: string
  permission_key: string
  permission_type: string
  path: string | null
  icon: string | null
  sort_order: string
  status: string
}

interface Permission extends permission {
  children?: Permission[]
}

// 获取菜单列表
export async function GET() {
  try {
    const user = await verifyUser()

    if (!user) {
      return NextResponse.json(
        { error: '未登录或登录已过期' },
        { status: 401 }
      )
    }

    // 获取用户角色的权限
    const permissions = await prisma.permission.findMany({
      where: {
        roles: {
          some: {
            role_id: user.role_id
          }
        },
        parent_id: null, // 只获取顶级菜单
        permission_type: 'menu', // 只获取菜单类型的权限
        status: 1 // 只获取启用状态的权限
      },
      include: {
        roles: true
      },
      orderBy: {
        sort_order: 'asc'
      }
    })

    // 递归获取子菜单
    const getChildren = async (parentId: number): Promise<Permission[]> => {
      const children = await prisma.permission.findMany({
        where: {
          parent_id: parentId,
          permission_type: 'menu',
          status: 1
        },
        include: {
          roles: true
        },
        orderBy: {
          sort_order: 'asc'
        }
      })

      const result: Permission[] = []
      for (const child of children) {
        const childPermission = child as Permission
        childPermission.children = await getChildren(child.permission_id)
        result.push(childPermission)
      }
      return result
    }

    // 为每个顶级菜单获取子菜单
    const result: Permission[] = []
    for (const permission of permissions) {
      const parentPermission = permission as Permission
      parentPermission.children = await getChildren(permission.permission_id)
      result.push(parentPermission)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('获取菜单失败:', error)
    return NextResponse.json(
      { error: '获取菜单失败' },
      { status: 500 }
    )
  }
} 