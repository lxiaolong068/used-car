import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { authRoutes } from './routes/auth.routes';
import { carRoutes } from './routes/car.routes';
import { costRoutes } from './routes/cost.routes';
import { revenueRoutes } from './routes/revenue.routes';
import { logRoutes } from './routes/log.routes';

export const build = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: true,
  });

  // 注册插件
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(jwt, {
    secret: config.jwt.secret,
  });

  // 注册错误处理中间件
  app.setErrorHandler(errorHandler);

  // 注册路由
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(carRoutes, { prefix: '/api/cars' });
  app.register(costRoutes, { prefix: '/api/costs' });
  app.register(revenueRoutes, { prefix: '/api/revenues' });
  app.register(logRoutes, { prefix: '/api/logs' });

  return app;
};

// 启动服务器
if (require.main === module) {
  const start = async () => {
    try {
      const app = await build();
      await app.listen({
        port: config.server.port,
        host: config.server.host,
      });
      console.log(`Server is running on http://${config.server.host}:${config.server.port}`);
    } catch (err) {
      console.error('Error starting server:', err);
      process.exit(1);
    }
  };
  start();
} 