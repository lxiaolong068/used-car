import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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
export async function GET(request: Request) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取用户的所有菜单权限
    const permissions = await prisma.$queryRaw<RawPermission[]>`
      SELECT 
        CAST(p.permission_id AS CHAR) as permission_id,
        CAST(p.parent_id AS CHAR) as parent_id,
        p.permission_name,
        p.permission_key,
        p.permission_type,
        p.path,
        p.icon,
        CAST(p.sort_order AS SIGNED) as sort_order,
        CAST(p.status AS SIGNED) as status
      FROM permission p
      INNER JOIN role_permission rp ON p.permission_id = rp.permission_id
      INNER JOIN role r ON rp.role_id = r.role_id
      INNER JOIN user u ON u.role_id = r.role_id
      WHERE u.user_id = ${user.user_id}
      AND p.status = 1
      AND p.permission_type = 'menu'
      ORDER BY p.sort_order ASC
    `

    if (!permissions || permissions.length === 0) {
      return NextResponse.json([])
    }

    // 将字符串ID转换回数字
    const formattedPermissions = permissions.map(p => ({
      ...p,
      permission_id: parseInt(p.permission_id),
      parent_id: p.parent_id ? parseInt(p.parent_id) : null,
      sort_order: parseInt(p.sort_order),
      status: parseInt(p.status),
      children: []
    }))

    // 构建菜单树
    const buildMenuTree = (items: Permission[], parentId: number | null = null): Permission[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildMenuTree(items, item.permission_id)
        }))
    }

    const menuTree = buildMenuTree(formattedPermissions)

    return NextResponse.json(menuTree)
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    return NextResponse.json({ error: '获取菜单列表失败' }, { status: 500 })
  }
} 