import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { permission } from '@prisma/client'

interface RawPermission {
  permission_id: number
  parent_id: number | null
  permission_name: string
  permission_key: string
  permission_type: 'menu' | 'button' | 'api'
  path: string | null
  component: string | null
  icon: string | null
  sort_order: number
  status: number
  create_time: Date
}

interface Permission extends permission {
  children?: Permission[]
}

// 获取菜单列表
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      where: {
        permission_type: 'menu',
        status: 1,
        roles: {
          some: {
            role: {
              role_key: {
                in: ['super_admin', 'admin'], // 允许访问的角色
              },
            },
          },
        },
      },
      orderBy: {
        sort_order: 'asc',
      },
    })

    // 构建菜单树
    const buildMenuTree = (items: RawPermission[], parentId: number | null = null): RawPermission[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildMenuTree(items, item.permission_id),
        }))
    }

    const menuTree = buildMenuTree(permissions)

    return NextResponse.json(menuTree)
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    return NextResponse.json(
      { error: '获取菜单列表失败' },
      { status: 500 }
    )
  }
} 