import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: '无效的车辆ID' }, { status: 400 })
    }

    // 获取车辆基本信息和相关的收入支出数据
    const carInfo = await prisma.car_info.findUnique({
      where: { vehicle_id: vehicleId },
      include: {
        cost_management: {
          select: {
            amount: true,
            type: true,
            payment_date: true,
            remark: true
          }
        },
        revenue_management: {
          select: {
            amount: true,
            payment_date: true,
            remark: true
          }
        }
      }
    })

    if (!carInfo) {
      return NextResponse.json({ error: '车辆不存在' }, { status: 404 })
    }

    // 计算总收入
    const totalRevenue = carInfo.revenue_management.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    // 按类型统计成本
    const costByType = carInfo.cost_management.reduce((acc, item) => {
      const type = item.type
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type] += Number(item.amount)
      return acc
    }, {} as Record<string, number>)

    // 计算总成本
    const totalCost = carInfo.cost_management.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    // 计算利润
    const profit = totalRevenue - totalCost

    return NextResponse.json({
      vehicle_info: {
        vin: carInfo.vin,
        vehicle_model: carInfo.vehicle_model,
        register_date: carInfo.register_date,
        purchase_date: carInfo.purchase_date,
        mileage: carInfo.mileage
      },
      financial_summary: {
        total_revenue: totalRevenue,
        total_cost: totalCost,
        profit: profit,
        cost_breakdown: costByType
      },
      details: {
        revenues: carInfo.revenue_management.map(rev => ({
          amount: rev.amount,
          date: rev.payment_date,
          remark: rev.remark
        })),
        costs: carInfo.cost_management.map(cost => ({
          amount: cost.amount,
          type: cost.type,
          date: cost.payment_date,
          remark: cost.remark
        }))
      }
    })
  } catch (error) {
    console.error('获取车辆财务汇总失败:', error)
    return NextResponse.json({ error: '获取车辆财务汇总失败' }, { status: 500 })
  }
} 