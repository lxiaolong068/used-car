import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // 检查是否为管理员用户
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { error: '不能删除管理员用户' },
        { status: 403 }
      )
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: '用户删除成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    )
  }
}
