import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true, user: session.user },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: '未登录或会话已过期' },
      { status: 401 }
    )
  }
}
