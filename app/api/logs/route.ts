import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const actionType = url.searchParams.get('actionType') || 'all';

    const skip = (page - 1) * pageSize;

    const where: Prisma.operation_logWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { details: { contains: search } },
                { action_type: { contains: search } },
                { user: { username: { contains: search } } },
              ],
            }
          : {},
        actionType !== 'all'
          ? {
              action_type: actionType,
            }
          : {},
      ],
    };

    const [logs, total] = await Promise.all([
      prisma.operation_log.findMany({
        where,
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          create_time: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.operation_log.count({ where }),
    ]);

    const formattedLogs = logs.map((log) => ({
      ...log,
      username: log.user?.username || '未知用户',
      user: undefined,
    }));

    return NextResponse.json({
      logs: formattedLogs,
      total,
    });
  } catch (error) {
    console.error('获取操作日志失败:', error);
    return NextResponse.json(
      { 
        error: '获取操作日志失败', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}