import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

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

interface Permission {
  permission_id: number
  parent_id: number | null
  permission_name: string
  permission_key: string
  permission_type: string
  path: string | null
  icon: string | null
  sort_order: number
  status: number
  children: Permission[]
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
        parent_id: null // 只获取顶级菜单
      },
      include: {
        children: {
          include: {
            children: true // 获取三级菜单
          }
        }
      },
      orderBy: {
        sort_order: 'asc'
      }
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error('获取菜单失败:', error)
    return NextResponse.json(
      { error: '获取菜单失败' },
      { status: 500 }
    )
  }
} 