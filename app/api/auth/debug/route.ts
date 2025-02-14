import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
      authenticated: !!session,
      session,
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
        NODE_ENV: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
