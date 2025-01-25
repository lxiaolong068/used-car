import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { authenticate, checkRole } from '../middlewares/auth';

const carSchema = z.object({
  vin: z.string().min(17).max(17),
  vehicle_model: z.string().min(2).max(50),
  mileage: z.number().positive(),
  register_date: z.string().transform((str) => new Date(str)),
  purchase_date: z.string().transform((str) => new Date(str)),
});

const updateCarSchema = carSchema.partial();

export async function carRoutes(fastify: FastifyInstance) {
  // 中间件：所有路由都需要认证
  fastify.addHook('preHandler', authenticate);

  // 创建车辆信息
  fastify.post('/', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const body = carSchema.parse(request.body);

    const car = await prisma.carInfo.create({
      data: body,
    });

    return reply.status(201).send({
      success: true,
      data: car,
    });
  });

  // 获取车辆列表（分页）
  fastify.get('/', async (request) => {
    const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };
    const skip = (page - 1) * limit;

    const [total, cars] = await Promise.all([
      prisma.carInfo.count(),
      prisma.carInfo.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      success: true,
      data: {
        items: cars,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  // 获取单个车辆信息
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const car = await prisma.carInfo.findUnique({
      where: { id: parseInt(id) },
      include: {
        costs: true,
        revenues: true,
      },
    });

    if (!car) {
      return reply.status(404).send({
        success: false,
        message: '车辆不存在',
      });
    }

    return {
      success: true,
      data: car,
    };
  });

  // 更新车辆信息
  fastify.patch('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateCarSchema.parse(request.body);

    const car = await prisma.carInfo.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return {
      success: true,
      data: car,
    };
  });

  // 删除车辆信息
  fastify.delete('/:id', { preHandler: checkRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.carInfo.delete({
      where: { id: parseInt(id) },
    });

    return {
      success: true,
      message: '删除成功',
    };
  });
} 