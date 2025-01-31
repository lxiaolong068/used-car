import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'
import { Prisma } from '@prisma/client'

// 获取权限列表
export async function GET() {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const permissions = await prisma.permission.findMany({
      include: {
        children: true,
        parent: true,
        roles: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        permission_id: 'asc'
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
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const data = await request.json()
    
    const permission = await prisma.permission.create({
      data: {
        permission_name: data.permission_name,
        permission_key: data.permission_key,
        path: data.path || null,
        icon: data.icon || null,
        parent_id: data.parent_id || null
      },
      include: {
        children: true,
        parent: true
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