import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 验证 token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-secret-key')
    
    return NextResponse.json(
      { authenticated: true, user: decoded },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: '未登录或会话已过期' },
      { status: 401 }
    )
  }
}
