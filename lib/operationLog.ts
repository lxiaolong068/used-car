import prisma from './prisma';

export async function recordOperation(userId: number, operation: string, details?: string) {
  return await prisma.operation_log.create({
    data: {
      user_id: userId,
      operation,
      details: details || '',
      create_time: new Date()
    }
  });
}
