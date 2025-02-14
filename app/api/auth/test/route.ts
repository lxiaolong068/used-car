import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: {
        username: 'admin'
      },
      select: {
        id: true,
        username: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 返回用户信息（不包含实际密码）
    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      passwordLength: user.password.length,
      isHashed: user.password.startsWith('$2')  // bcrypt hash 总是以 $2 开头
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 仅在开发环境中使用
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  try {
    const hashedPassword = await hash('123456', 10);
    
    // 更新或创建管理员用户
    const user = await prisma.user.upsert({
      where: {
        username: 'admin'
      },
      update: {
        password: hashedPassword
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        email: 'admin@example.com'
      }
    });

    return NextResponse.json({
      message: 'Admin user created/updated',
      id: user.id,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
