import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 更新权限
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const updatedPermission = await prisma.permission.update({
      where: {
        permission_id: parseInt(params.id),
      },
      data,
    })

    return NextResponse.json(updatedPermission)
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
    await prisma.permission.delete({
      where: {
        permission_id: parseInt(params.id),
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('删除权限失败:', error)
    return NextResponse.json(
      { error: '删除权限失败' },
      { status: 500 }
    )
  }
} 