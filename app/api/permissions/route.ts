import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取权限列表
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        sort_order: 'asc'
      }
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

// 创建权限
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const permission = await prisma.permission.create({
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
    console.error('创建权限失败:', error)
    return NextResponse.json(
      { error: '创建权限失败' },
      { status: 500 }
    )
  }
} 