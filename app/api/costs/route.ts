import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

// 获取费用列表
export async function GET(request: Request) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(Math.max(1, parseInt(searchParams.get('pageSize') || '5')), 100) // 限制每页最大100条
    const vin = searchParams.get('vin')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const skip = (page - 1) * pageSize

    // 添加VIN码格式验证
    if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      return NextResponse.json(
        { error: '无效的车架号格式' }, 
        { status: 400 }
      )
    }

    // 费用类型白名单验证
    const validTypes = ['purchase', 'maintenance', 'insurance', 'other']
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: '无效的费用类型' },
        { status: 400 }
      )
    }

    // 日期格式验证
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if ((startDate && !dateRegex.test(startDate)) || (endDate && !dateRegex.test(endDate))) {
      return NextResponse.json(
        { error: '日期格式应为YYYY-MM-DD' },
        { status: 400 }
      )
    }

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

    // 如果有费用类型筛选
    if (type) {
      where = {
        ...where,
        type: type
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

    console.log('查询条件:', where)  // 添加日志以便调试

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

    console.log('查询结果:', costs)  // 添加日志以便调试

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
    return NextResponse.json({ error: '获取费用列表失败' }, { status: 500 })
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
    const { vehicle_id, amount, remark, type, payment_phase, payment_date } = data

    // 验证必填字段
    if (!vehicle_id || !amount || !remark || !type || !payment_phase || !payment_date) {
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
        vehicle_id,
        amount: parseFloat(amount),
        remark,
        type,
        payment_phase,
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