import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const vehicleId = parseInt(params.vehicleId)
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: '无效的车辆ID' },
        { status: 400 }
      )
    }

    // 获取该车辆的最新收款阶段
    const latestRevenue = await prisma.revenue_management.findFirst({
      where: {
        vehicle_id: vehicleId
      },
      orderBy: {
        revenue_phase: 'desc'
      },
      select: {
        revenue_phase: true
      }
    })

    // 如果没有收款记录，返回1，否则返回最新阶段+1
    const nextPhase = latestRevenue ? latestRevenue.revenue_phase + 1 : 1

    return NextResponse.json({ nextPhase })
  } catch (error) {
    console.error('获取最新收款阶段失败:', error)
    return NextResponse.json(
      { error: '获取最新收款阶段失败' },
      { status: 500 }
    )
  }
} 