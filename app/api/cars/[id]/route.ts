import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyUser } from '@/lib/auth'

// 获取单个车辆信息
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

    // 查询车辆信息
    const car = await prisma.car_info.findUnique({
      where: {
        vehicle_id: vehicleId
      }
    })

    if (!car) {
      return NextResponse.json({ error: '车辆不存在' }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error('获取车辆信息失败:', error)
    return NextResponse.json({ error: '获取车辆信息失败' }, { status: 500 })
  }
}

// 更新车辆信息
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

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: '无效的车辆ID' }, { status: 400 })
    }

    // 获取请求数据
    const data = await request.json()
    const { vin, vehicle_model, register_date, purchase_date, mileage } = data

    // 验证必填字段
    if (!vin || !vehicle_model || !register_date || !purchase_date || !mileage) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    // 更新车辆信息
    const car = await prisma.car_info.update({
      where: {
        vehicle_id: vehicleId
      },
      data: {
        vin,
        vehicle_model,
        register_date: new Date(register_date),
        purchase_date: new Date(purchase_date),
        mileage: parseFloat(mileage),
        update_time: new Date()
      }
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error('更新车辆信息失败:', error)
    return NextResponse.json({ error: '更新车辆信息失败' }, { status: 500 })
  }
}

// 删除车辆
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

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: '无效的车辆ID' }, { status: 400 })
    }

    // 删除车辆
    await prisma.car_info.delete({
      where: {
        vehicle_id: vehicleId
      }
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除车辆失败:', error)
    return NextResponse.json({ error: '删除车辆失败' }, { status: 500 })
  }
} 