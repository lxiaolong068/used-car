import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    // 验证用户登录状态
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    )
    }, { status: 401 });
    }

    const vehicleId = parseInt(params.vehicleId);
    if (isNaN(vehicleId)) {
      return NextResponse.json(
      { error: '无效的车辆ID' },
      { status: 400 }
    );
    }

    // 获取该车辆的最新付款阶段
    const latestPhase = await prisma.cost_management.findFirst({
      where: {
        vehicle_id: vehicleId
      },
      orderBy: {
        payment_phase: 'desc'
      },
      select: {
        payment_phase: true
      }
    });

    // 如果没有记录，返回 1，否则返回最新阶段 + 1
    const nextPhase = latestPhase ? latestPhase.payment_phase + 1 : 1;

    return NextResponse.json({ nextPhase });
  } catch (error) {
    console.error('获取最新付款阶段失败:', error);
    return NextResponse.json(
      { error: '获取最新付款阶段失败' },
      { status: 500 }
    );
  }
} 