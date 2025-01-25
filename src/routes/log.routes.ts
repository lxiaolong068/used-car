import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { authenticate, checkRole } from '../middlewares/auth';

const logSchema = z.object({
  user_id: z.number().int().positive(),
  action: z.string().min(1).max(50),
  details: z.string(),
});

export async function logRoutes(fastify: FastifyInstance) {
  // 中间件：所有路由都需要认证
  fastify.addHook('preHandler', authenticate);

  // 创建操作日志
  fastify.post('/', async (request, reply) => {
    const user = request.user as { id: number };
    const requestBody = request.body as Record<string, unknown>;
    const body = logSchema.parse({
      user_id: user.id,
      action: requestBody.action,
      details: requestBody.details,
    });

    const log = await prisma.operationLog.create({
      data: body,
    });

    return reply.status(201).send({
      success: true,
      data: log,
    });
  });

  // 获取操作日志列表（分页）
  fastify.get('/', { preHandler: checkRole(['admin']) }, async (request) => {
    const { page = 1, limit = 10, user_id } = request.query as {
      page?: number;
      limit?: number;
      user_id?: string;
    };
    const skip = (page - 1) * limit;

    const where = user_id ? { user_id: parseInt(user_id) } : {};

    const [total, logs] = await Promise.all([
      prisma.operationLog.count({ where }),
      prisma.operationLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      success: true,
      data: {
        items: logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  // 获取单个操作日志
  fastify.get('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const log = await prisma.operationLog.findUnique({
      where: { id: parseInt(id) },
    });

    if (!log) {
      return reply.status(404).send({
        success: false,
        message: '日志记录不存在',
      });
    }

    return {
      success: true,
      data: log,
    };
  });
} 