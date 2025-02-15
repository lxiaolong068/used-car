import { prisma } from './prisma';

// 获取操作类型
function getActionType(operation: string): string {
  if (operation.startsWith('添加')) return 'create';
  if (operation.startsWith('修改')) return 'update';
  if (operation.startsWith('删除')) return 'delete';
  return 'other';
}

export async function recordOperation(userId: string | number, operation: string, details?: string) {
  if (!userId) {
    throw new Error('userId is required for recordOperation');
  }

  const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

  // 创建操作日志记录
  return await prisma.operation_log.create({
    data: {
      user_id: numericUserId,  // 直接设置 user_id
      action_type: getActionType(operation),
      details: details || '',
      create_time: new Date(),
      ip_address: null  // 可选字段，设为 null
    }
  });
}
