import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// 验证用户是否登录
export async function verifyUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
  } catch (error) {
    console.error('验证用户失败:', error);
    return null;
  }
}

// 获取当前会话信息
export async function getServerSession() {
  const user = await verifyUser();
  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id as string,
      name: user.username as string,
      role: user.role as string,
    },
  };
} 