import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'

// 获取所有权限列表
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        sort_order: 'asc',
      },
      include: {
        parent: true,
      },
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error('获取权限列表失败:', error)
    return NextResponse.json(
      { error: '获取权限列表失败' },
      { status: 500 }
    )
  }
}

// 创建新权限
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const permission = await prisma.permission.create({
      data: {
        permission_name: data.permission_name,
        permission_key: data.permission_key,
        permission_type: data.permission_type,
        path: data.path,
        component: data.component,
        icon: data.icon,
        sort_order: data.sort_order,
        status: data.status,
        parent_id: data.parent_id,
      },
    })

    return NextResponse.json(permission)
  } catch (error) {
    console.error('创建权限失败:', error)
    return NextResponse.json(
      { error: '创建权限失败' },
      { status: 500 }
    )
  }
}