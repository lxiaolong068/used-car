import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { recordOperation } from '@/lib/operationLog'

// 获取车辆列表
export async function GET(request: Request) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    )
    }

    // 新增分页和搜索参数
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(Math.max(1, parseInt(searchParams.get('pageSize') || '5')), 100)
    const vin = searchParams.get('vin')
    const model = searchParams.get('model')
    const saleStatus = searchParams.get('saleStatus')
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}
    if (vin) {
      where.vin = { contains: vin }
    }
    if (model) {
      where.vehicle_model = { contains: model }
    }
    if (saleStatus !== null && saleStatus !== 'all' && saleStatus !== undefined) {
      where.sale_status = parseInt(saleStatus)
    }

    // 使用 Promise.all 替代事务查询
    const [total, cars] = await Promise.all([
      prisma.car_info.count({ where }),
      prisma.car_info.findMany({
        where,
        orderBy: { create_time: 'desc' },
        skip,
        take: pageSize,
        include: {
          cost_management: {
            select: {
              amount: true,
              payment_date: true
            }
          },
          revenue_management: {
            select: {
              amount: true,
              payment_date: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      total,
      data: cars,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    return NextResponse.json(
      { error: '获取车辆列表失败' },
      { status: 500 }
    )
  }
}

// 添加新车辆
export async function POST(request: Request) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    )
    }

    const data = await request.json()

    // 验证必填字段
    if (!data.vin || !data.vehicle_model) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      )
    }

    // 检查 VIN 是否已存在
    const existingCar = await prisma.car_info.findUnique({
      where: { vin: data.vin }
    })

    if (existingCar) {
      return NextResponse.json(
        { error: 'VIN 号已存在' },
        { status: 400 }
      )
    }

    // 创建新车辆记录
    const car = await prisma.car_info.create({
      data: {
        ...data,
        create_time: new Date(),
        update_time: new Date(),
        create_user: session.session.session.user.id,
        update_user: session.session.session.user.id
      }
    })

    // 记录操作日志
    await recordOperation(
      session.user.user_id,
      '添加车辆',
      `添加车辆：${data.brand} ${data.model}，车架号：${data.vin || '未填写'}`
    );

    return NextResponse.json(car)
  } catch (error) {
    console.error('添加车辆失败:', error)
    return NextResponse.json(
      { error: '添加车辆失败', details: error.message },
      { status: 500 }
    )
  }
}