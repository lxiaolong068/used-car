import { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      success: false,
      message: '未授权访问',
    });
  }
};

export const checkRole = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as { role: string };
      if (!roles.includes(user.role)) {
        reply.status(403).send({
          success: false,
          message: '权限不足',
        });
      }
    } catch (err) {
      reply.status(401).send({
        success: false,
        message: '未授权访问',
      });
    }
  };
}; 