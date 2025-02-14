import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials, req) {
        console.log('Authorizing with credentials:', { username: credentials?.username });

        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('请输入用户名和密码');
        }

        try {
          // 从数据库中查找用户
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
            select: {
              user_id: true,
              username: true,
              password: true,
              role: {
                select: {
                  role_key: true,
                  role_name: true
                }
              }
            },
          });

          console.log('Found user:', user ? 'yes' : 'no');

          if (!user) {
            console.log('User not found');
            throw new Error('用户名或密码错误');
          }

          // 验证密码
          console.log('Comparing passwords...');
          const isValid = await compare(credentials.password, user.password);
          console.log('Password valid:', isValid);

          if (!isValid) {
            console.log('Invalid password');
            throw new Error('用户名或密码错误');
          }

          console.log('Authentication successful');

          // 返回用户信息（不包含密码）
          return {
            id: String(user.user_id),
            name: user.username,
            role: user.role.role_key,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback:', { token, user });
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  debug: true,
};