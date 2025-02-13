import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    const userId = token?.sub ? parseInt(token.sub) : null;

    const data = await req.json();
    const { error, errorInfo, timestamp, userAgent, url, additionalData } = data;

    // 创建错误日志记录
    const errorLog = await prisma.errorLog.create({
      data: {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date(timestamp),
        userAgent,
        url,
        userId,
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
      },
    });

    return NextResponse.json({ success: true, id: errorLog.id });
  } catch (error) {
    console.error('保存错误日志失败:', error);
    return NextResponse.json(
      { error: '保存错误日志失败' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 