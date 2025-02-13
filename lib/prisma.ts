import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],  // 添加日志以便调试
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
