import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

// 获取单个费用信息
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

    const costId = parseInt(params.id)
    if (isNaN(costId)) {
      return NextResponse.json({ error: '无效的费用ID' }, { status: 400 })
    }

    // 查询费用信息
    const cost = await prisma.cost_management.findUnique({
      where: {
        cost_id: costId
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

    if (!cost) {
      return NextResponse.json({ error: '费用不存在' }, { status: 404 })
    }

    return NextResponse.json(cost)
  } catch (error) {
    console.error('获取费用信息失败:', error)
    return NextResponse.json({ error: '获取费用信息失败' }, { status: 500 })
  }
}

// 更新费用信息
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

    const costId = parseInt(params.id)
    if (isNaN(costId)) {
      return NextResponse.json({ error: '无效的费用ID' }, { status: 400 })
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

    // 更新费用信息
    const cost = await prisma.cost_management.update({
      where: {
        cost_id: costId
      },
      data: {
        vehicle_id,
        amount: parseFloat(amount),
        remark,
        type,
        payment_phase,
        payment_date: new Date(payment_date),
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
    console.error('更新费用信息失败:', error)
    return NextResponse.json({ error: '更新费用信息失败' }, { status: 500 })
  }
}

// 删除费用
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

    const costId = parseInt(params.id)
    if (isNaN(costId)) {
      return NextResponse.json({ error: '无效的费用ID' }, { status: 400 })
    }

    // 删除费用
    await prisma.cost_management.delete({
      where: {
        cost_id: costId
      }
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除费用失败:', error)
    return NextResponse.json({ error: '删除费用失败' }, { status: 500 })
  }
} 