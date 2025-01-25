import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { authenticate, checkRole } from '../middlewares/auth';

const revenueSchema = z.object({
  vehicle_id: z.number().int().positive(),
  amount: z.number().positive(),
  payment_date: z.string().transform((str) => new Date(str)),
});

const updateRevenueSchema = revenueSchema.partial();

export async function revenueRoutes(fastify: FastifyInstance) {
  // 中间件：所有路由都需要认证
  fastify.addHook('preHandler', authenticate);

  // 创建收入记录
  fastify.post('/', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const body = revenueSchema.parse(request.body);

    // 验证车辆是否存在
    const car = await prisma.carInfo.findUnique({
      where: { id: body.vehicle_id },
    });

    if (!car) {
      return reply.status(404).send({
        success: false,
        message: '车辆不存在',
      });
    }

    const revenue = await prisma.revenueManagement.create({
      data: body,
    });

    return reply.status(201).send({
      success: true,
      data: revenue,
    });
  });

  // 获取收入记录列表（分页）
  fastify.get('/', async (request) => {
    const { page = 1, limit = 10, vehicle_id } = request.query as {
      page?: number;
      limit?: number;
      vehicle_id?: string;
    };
    const skip = (page - 1) * limit;

    const where = vehicle_id ? { vehicle_id: parseInt(vehicle_id) } : {};

    const [total, revenues] = await Promise.all([
      prisma.revenueManagement.count({ where }),
      prisma.revenueManagement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { payment_date: 'desc' },
        include: {
          car: {
            select: {
              vin: true,
              vehicle_model: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        items: revenues,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  // 获取单个收入记录
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const revenue = await prisma.revenueManagement.findUnique({
      where: { id: parseInt(id) },
      include: {
        car: {
          select: {
            vin: true,
            vehicle_model: true,
          },
        },
      },
    });

    if (!revenue) {
      return reply.status(404).send({
        success: false,
        message: '收入记录不存在',
      });
    }

    return {
      success: true,
      data: revenue,
    };
  });

  // 更新收入记录
  fastify.patch('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateRevenueSchema.parse(request.body);

    if (body.vehicle_id) {
      const car = await prisma.carInfo.findUnique({
        where: { id: body.vehicle_id },
      });

      if (!car) {
        return reply.status(404).send({
          success: false,
          message: '车辆不存在',
        });
      }
    }

    const revenue = await prisma.revenueManagement.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return {
      success: true,
      data: revenue,
    };
  });

  // 删除收入记录
  fastify.delete('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.revenueManagement.delete({
      where: { id: parseInt(id) },
    });

    return {
      success: true,
      message: '删除成功',
    };
  });

  // 获取收入统计
  fastify.get('/statistics/summary', async (request) => {
    const { start_date, end_date } = request.query as {
      start_date?: string;
      end_date?: string;
    };

    const where = {
      payment_date: {
        ...(start_date && { gte: new Date(start_date) }),
        ...(end_date && { lte: new Date(end_date) }),
      },
    };

    const revenues = await prisma.revenueManagement.groupBy({
      by: ['vehicle_id'],
      where,
      _sum: {
        amount: true,
      },
    });

    const costs = await prisma.costManagement.groupBy({
      by: ['vehicle_id'],
      where,
      _sum: {
        amount: true,
      },
    });

    // 计算总收入、总成本和利润
    const totalRevenue = revenues.reduce((sum: number, item: { _sum: { amount: bigint | null } }) => 
      sum + (item._sum.amount ? Number(item._sum.amount) : 0), 0);
    const totalCost = costs.reduce((sum: number, item: { _sum: { amount: bigint | null } }) => 
      sum + (item._sum.amount ? Number(item._sum.amount) : 0), 0);
    const profit = totalRevenue - totalCost;

    return {
      success: true,
      data: {
        totalRevenue,
        totalCost,
        profit,
        period: {
          start: start_date,
          end: end_date,
        },
      },
    };
  });
} 