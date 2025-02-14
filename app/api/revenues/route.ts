import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 获取收入列表
export async function GET(request: Request) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    )
    }, { status: 401 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(Math.max(1, parseInt(searchParams.get('pageSize') || '5')), 100)
    const vin = searchParams.get('vin')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const skip = (page - 1) * pageSize

    // 添加VIN码格式验证 - 只在输入的情况下进行基本验证
    if (vin && !/^[A-Z0-9]+$/i.test(vin)) {
      return NextResponse.json(
        { error: '车架号只能包含字母和数字' }, 
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

    // 获取总记录数和总收入
    const [total, totalAmount] = await prisma.$transaction([
      prisma.revenue_management.count({
        where
      }),
      prisma.revenue_management.aggregate({
        where,
        _sum: {
          amount: true
        }
      })
    ])

    // 获取分页数据
    const revenues = await prisma.revenue_management.findMany({
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
      data: revenues,
      pagination: {
        current: page,
        pageSize,
        total
      },
      totalAmount: totalAmount._sum.amount || 0
    })
  } catch (error) {
    console.error('获取收入列表失败:', error)
    return NextResponse.json(
      { error: '获取收入列表失败' },
      { status: 500 }
    )
  }
}

// 添加新收入
export async function POST(request: Request) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    )
    }, { status: 401 })
    }

    // 获取请求数据
    const data = await request.json()
    const { vehicle_id, amount, remark = '', revenue_phase, payment_date } = data

    // 验证必填字段
    if (!vehicle_id || !amount || !revenue_phase || !payment_date) {
      return NextResponse.json(
      { error: '缺少必填字段' },
      { status: 400 }
    )
    }

    // 验证金额必须大于零
    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
      { error: '金额必须大于零' },
      { status: 400 }
    )
    }

    // 验证收款阶段必须大于等于1
    if (parseInt(revenue_phase) < 1) {
      return NextResponse.json(
      { error: '收款阶段必须大于等于1' },
      { status: 400 }
    )
    }

    // 创建新收入记录
    const revenue = await prisma.revenue_management.create({
      data: {
        vehicle_id,
        amount: parseFloat(amount),
        remark,
        revenue_phase,
        payment_date: new Date(payment_date)
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

    return NextResponse.json(revenue)
  } catch (error) {
    console.error('添加收入失败:', error)
    return NextResponse.json(
      { error: '添加收入失败' },
      { status: 500 }
    )
  }
} 