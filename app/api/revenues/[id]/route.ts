import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

// 获取单个收入信息
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

    const revenueId = parseInt(params.id)
    if (isNaN(revenueId)) {
      return NextResponse.json({ error: '无效的收入ID' }, { status: 400 })
    }

    // 查询收入信息
    const revenue = await prisma.revenue_management.findUnique({
      where: {
        revenue_id: revenueId
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

    if (!revenue) {
      return NextResponse.json({ error: '收入记录不存在' }, { status: 404 })
    }

    return NextResponse.json(revenue)
  } catch (error) {
    console.error('获取收入信息失败:', error)
    return NextResponse.json({ error: '获取收入信息失败' }, { status: 500 })
  }
}

// 更新收入信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const revenueId = parseInt(params.id)
    if (isNaN(revenueId)) {
      return NextResponse.json({ error: '无效的收入ID' }, { status: 400 })
    }

    // 获取请求数据
    const data = await request.json()
    const { vehicle_id, amount, remark, revenue_phase, payment_date } = data

    // 验证必填字段
    if (!vehicle_id || !amount || !remark || !revenue_phase || !payment_date) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    // 验证金额必须大于零
    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: '金额必须大于零' }, { status: 400 })
    }

    // 验证收款阶段必须大于等于1
    if (parseInt(revenue_phase) < 1) {
      return NextResponse.json({ error: '收款阶段必须大于等于1' }, { status: 400 })
    }

    // 更新收入信息
    const revenue = await prisma.revenue_management.update({
      where: {
        revenue_id: revenueId
      },
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
    console.error('更新收入信息失败:', error)
    return NextResponse.json({ error: '更新收入信息失败' }, { status: 500 })
  }
}

// 删除收入
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户是否登录
    const user = await verifyUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const revenueId = parseInt(params.id)
    if (isNaN(revenueId)) {
      return NextResponse.json({ error: '无效的收入ID' }, { status: 400 })
    }

    // 删除收入
    await prisma.revenue_management.delete({
      where: {
        revenue_id: revenueId
      }
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除收入失败:', error)
    return NextResponse.json({ error: '删除收入失败' }, { status: 500 })
  }
} 