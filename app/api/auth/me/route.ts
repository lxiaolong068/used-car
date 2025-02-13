import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1]

    console.log('GET /api/auth/me - Token:', token)

    if (!token) {
      console.log('GET /api/auth/me - No token found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    console.log('GET /api/auth/me - Decoded token:', payload)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      include: {
        role: true
      }
    })

    console.log('GET /api/auth/me - User found:', user)

    if (!user) {
      console.log('GET /api/auth/me - User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    })
  } catch (error) {
    console.error('GET /api/auth/me - Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
