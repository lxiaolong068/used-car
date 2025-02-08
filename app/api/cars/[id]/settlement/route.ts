import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: '无效的车辆ID' }, { status: 400 })
    }

    // 获取收入总和
    const revenueResult = await prisma.revenue_management.aggregate({
      where: {
        vehicle_id: vehicleId
      },
      _sum: {
        amount: true
      }
    })

    // 获取成本总和
    const costResult = await prisma.cost_management.aggregate({
      where: {
        vehicle_id: vehicleId
      },
      _sum: {
        amount: true
      }
    })

    const totalRevenue = revenueResult._sum.amount?.toNumber() || 0
    const totalCost = costResult._sum.amount?.toNumber() || 0

    return NextResponse.json({
      totalRevenue,
      totalCost
    })
  } catch (error) {
    console.error('获取结算信息失败:', error)
    return NextResponse.json({ error: '获取结算信息失败' }, { status: 500 })
  }
} 