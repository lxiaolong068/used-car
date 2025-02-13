import { JWT } from 'next-auth/jwt';
import { Account, Profile, Session, User } from 'next-auth';
import { Provider } from 'next-auth/providers';
import { verifyUser } from './auth'; // 导入您的 verifyUser 函数

interface CustomCallbacks {
  jwt: (params: {
    token: JWT;
    user?: User | undefined;
    account?: Account | null | undefined;
    profile?: Profile | undefined;
    isNewUser?: boolean | undefined;
  }) => Promise<JWT>;
  session: (params: { session: Session; token: JWT }) => Promise<Session>;
}

export const CustomProvider = (): Provider => ({
  id: 'custom-provider',
  name: 'Custom Provider',
  type: 'credentials', // 使用 credentials 类型
  credentials: {}, // 不需要实际的 credentials
  async authorize(credentials, req) {
    // 在这里验证用户，可以使用您的 verifyUser 函数
    try {
      const user = await verifyUser(); // 调用您的 verifyUser 函数
      if (user) {
        // 返回用户信息，next-auth 会将其放入 session
        return user;
      } else {
        return null; // 验证失败
      }
    } catch (error) {
      console.error('CustomProvider authorize error:', error);
      return null;
    }
  },
});


export const customCallbacks: Partial<CustomCallbacks> = {
    async jwt({ token, user }) {
      if (user) {
        // 将您的用户信息添加到 JWT
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // 将 JWT 中的用户信息添加到 session
      session.user = token.user as any;
      return session;
    },
  }; 