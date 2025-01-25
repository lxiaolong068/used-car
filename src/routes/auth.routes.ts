import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { Password } from '../utils/password';
import { authenticate } from '../middlewares/auth';

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  role: z.enum(['admin', 'user']),
});

export async function authRoutes(fastify: FastifyInstance) {
  // 用户注册
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const hashedPassword = await Password.hash(body.password);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
        role: body.role,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return reply.status(201).send({
      success: true,
      data: user,
    });
  });

  // 用户登录
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        message: '用户名或密码错误',
      });
    }

    const isValid = await Password.compare(user.password, body.password);
    if (!isValid) {
      return reply.status(401).send({
        success: false,
        message: '用户名或密码错误',
      });
    }

    const token = fastify.jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      {
        expiresIn: '24h',
      }
    );

    return reply.send({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  });

  // 获取当前用户信息
  fastify.get('/me', { preHandler: authenticate }, async (request) => {
    const user = request.user as { id: number };
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return {
      success: true,
      data: userData,
    };
  });
} 