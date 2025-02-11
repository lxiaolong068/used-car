import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

// 获取费用列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const vin = searchParams.get('vin')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const skip = (page - 1) * pageSize

    // 构建查询条件
    let where: any = {}
    
    // 如果有车架号筛选
    if (vin) {
      where = {
        car_info: {
          vin: {
            contains: vin
          }
        }
      }
    }

    // 如果有日期区间筛选
    if (startDate || endDate) {
      where = {
        ...where,
        payment_date: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) })
        }
      }
    }

    // 获取总记录数和总费用
    const [total, totalAmount] = await prisma.$transaction([
      prisma.cost_management.count({
        where
      }),
      prisma.cost_management.aggregate({
        where,
        _sum: {
          amount: true
        }
      })
    ])

    // 获取分页数据
    const costs = await prisma.cost_management.findMany({
      where,
      include: {
        car_info: {
          select: {
            vehicle_model: true,
            vin: true
          }
        }
      },
      orderBy: {
        create_time: 'desc'
      },
      skip,
      take: pageSize
    })

    return NextResponse.json({
      data: costs,
      pagination: {
        current: page,
        pageSize,
        total
      },
      totalAmount: totalAmount._sum.amount || 0
    })
  } catch (error) {
    console.error('获取费用列表失败:', error)
    return NextResponse.json(
      { error: '获取费用列表失败' },
      { status: 500 }
    )
  }
}

// 添加新费用
export async function POST(request: Request) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取请求数据
    const data = await request.json()
    const { vehicle_id, amount, remark = '', payment_phase, payment_date } = data

    // 验证必填字段
    if (!vehicle_id || !amount || !payment_phase || !payment_date) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    // 验证金额必须大于零
    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: '金额必须大于零' }, { status: 400 })
    }

    // 验证付款阶段必须大于等于1
    if (parseInt(payment_phase) < 1) {
      return NextResponse.json({ error: '付款阶段必须大于等于1' }, { status: 400 })
    }

    // 创建新费用记录
    const cost = await prisma.cost_management.create({
      data: {
        vehicle_id: parseInt(vehicle_id),
        amount: parseFloat(amount),
        remark,
        payment_phase: parseInt(payment_phase),
        payment_date: new Date(payment_date),
        create_time: new Date(),
        update_time: new Date()
      },
      include: {
        car_info: {
          select: {
            vehicle_model: true,
            vin: true
          }
        }
      }
    })

    return NextResponse.json(cost)
  } catch (error) {
    console.error('添加费用失败:', error)
    return NextResponse.json({ error: '添加费用失败' }, { status: 500 })
  }
} 