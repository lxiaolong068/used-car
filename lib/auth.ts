import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import prisma from './prisma'

// 验证用户是否登录
export async function verifyUser() {
  try {
    // 获取 token
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    // 验证 token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: {
        user_id: payload.user_id as number
      },
      include: {
        role: true
      }
    })

    return user
  } catch (error) {
    console.error('验证用户失败:', error)
    return null
  }
} 