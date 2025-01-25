import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  // Zod 验证错误
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: '输入验证失败',
      errors: error.errors,
    });
  }

  // Prisma 错误
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return reply.status(409).send({
          success: false,
          message: '记录已存在',
        });
      case 'P2025':
        return reply.status(404).send({
          success: false,
          message: '记录不存在',
        });
      default:
        return reply.status(500).send({
          success: false,
          message: '数据库操作失败',
        });
    }
  }

  // JWT 错误
  if (error.statusCode === 401) {
    return reply.status(401).send({
      success: false,
      message: '未授权访问',
    });
  }

  // 默认错误
  return reply.status(500).send({
    success: false,
    message: '服务器内部错误',
  });
}; 