import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { authenticate, checkRole } from '../middlewares/auth';

const costSchema = z.object({
  vehicle_id: z.number().int().positive(),
  amount: z.number().positive(),
  type: z.string().min(1).max(20),
  payment_phase: z.number().int().positive(),
  payment_date: z.string().transform((str) => new Date(str)),
});

const updateCostSchema = costSchema.partial();

export async function costRoutes(fastify: FastifyInstance) {
  // 中间件：所有路由都需要认证
  fastify.addHook('preHandler', authenticate);

  // 创建成本记录
  fastify.post('/', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const body = costSchema.parse(request.body);

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

    const cost = await prisma.costManagement.create({
      data: body,
    });

    return reply.status(201).send({
      success: true,
      data: cost,
    });
  });

  // 获取成本记录列表（分页）
  fastify.get('/', async (request) => {
    const { page = 1, limit = 10, vehicle_id } = request.query as {
      page?: number;
      limit?: number;
      vehicle_id?: string;
    };
    const skip = (page - 1) * limit;

    const where = vehicle_id ? { vehicle_id: parseInt(vehicle_id) } : {};

    const [total, costs] = await Promise.all([
      prisma.costManagement.count({ where }),
      prisma.costManagement.findMany({
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
        items: costs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  // 获取单个成本记录
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const cost = await prisma.costManagement.findUnique({
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

    if (!cost) {
      return reply.status(404).send({
        success: false,
        message: '成本记录不存在',
      });
    }

    return {
      success: true,
      data: cost,
    };
  });

  // 更新成本记录
  fastify.patch('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateCostSchema.parse(request.body);

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

    const cost = await prisma.costManagement.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return {
      success: true,
      data: cost,
    };
  });

  // 删除成本记录
  fastify.delete('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.costManagement.delete({
      where: { id: parseInt(id) },
    });

    return {
      success: true,
      message: '删除成功',
    };
  });
} 