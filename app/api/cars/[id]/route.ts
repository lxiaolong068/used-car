import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { recordOperation } from '@/lib/operationLog'

// 获取单个车辆信息
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: '无效的车辆ID' },
        { status: 400 }
      )
    }

    // 查询车辆信息
    const car = await prisma.car_info.findUnique({
      where: {
        vehicle_id: vehicleId
      }
    })

    if (!car) {
      return NextResponse.json(
        { error: '车辆不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error('获取车辆信息失败:', error)
    return NextResponse.json(
      { error: '获取车辆信息失败' },
      { status: 500 }
    )
  }
}

// 更新车辆信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: '无效的车辆ID' },
        { status: 400 }
      )
    }

    // 获取请求数据
    const data = await request.json()
    const { vin, vehicle_model, register_date, purchase_date, mileage, sale_date, customer_name, sale_status } = data

    // 验证必填字段
    if (!vin || !vehicle_model || !register_date || !purchase_date || !mileage) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 验证销售状态
    const saleStatusNum = Number(sale_status)
    if (isNaN(saleStatusNum) || ![0, 1].includes(saleStatusNum)) {
      return NextResponse.json(
        { error: '无效的销售状态' },
        { status: 400 }
      )
    }

    // 更新车辆信息
    const updateData = {
      vin,
      vehicle_model,
      register_date: new Date(register_date),
      purchase_date: new Date(purchase_date),
      mileage: parseFloat(mileage),
      sale_date: sale_date ? new Date(sale_date) : null,
      customer_name: customer_name || null,
      update_time: new Date()
    }

    // 使用类型断言添加 sale_status
    const car = await prisma.car_info.update({
      where: {
        vehicle_id: vehicleId
      },
      data: {
        ...updateData,
        sale_status: saleStatusNum
      } as any
    })

    // 记录操作日志
    await recordOperation(
      session.user.user_id,
      '修改车辆',
      `修改车辆信息：${car.vin} ${car.vehicle_model}，ID：${car.vehicle_id}`
    );

    return NextResponse.json(car)
  } catch (error) {
    console.error('更新车辆信息失败:', error)
    return NextResponse.json(
      { error: '更新车辆信息失败' },
      { status: 500 }
    )
  }
}

// 删除车辆
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
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

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: '无效的车辆ID' },
        { status: 400 }
      )
    }

    // 先获取车辆信息，用于日志记录
    const car = await prisma.car_info.findUnique({
      where: {
        vehicle_id: vehicleId
      }
    })

    if (!car) {
      return NextResponse.json(
        { error: '车辆不存在' },
        { status: 404 }
      );
    }

    await prisma.car_info.delete({
      where: {
        vehicle_id: vehicleId
      }
    })

    // 记录操作日志
    await recordOperation(
      session.user.user_id,
      '删除车辆',
      `删除车辆：${car.vin} ${car.vehicle_model}，ID：${car.vehicle_id}`
    );

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除车辆失败:', error)
    return NextResponse.json(
      { error: '删除车辆失败' },
      { status: 500 }
    )
  }
} 