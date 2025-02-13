import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await verifyUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '未登录或登录已过期' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
} 