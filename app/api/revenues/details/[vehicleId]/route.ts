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

    // 获取收入明细
    const details = await prisma.revenue_management.findMany({
      where: {
        vehicle_id: vehicleId
      },
      orderBy: [
        { revenue_phase: 'asc' },
        { payment_date: 'asc' }
      ]
    })

    return NextResponse.json(details)
  } catch (error) {
    console.error('获取收入明细失败:', error)
    return NextResponse.json(
      { error: '获取收入明细失败' },
      { status: 500 }
    )
  }
} 