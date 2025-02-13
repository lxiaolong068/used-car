import { monitorDatabase } from './db-monitor';
import { prisma } from '@/lib/prisma';

async function cleanupOldLogs() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await prisma.errorLog.deleteMany({
    where: {
      timestamp: {
        lt: thirtyDaysAgo
      }
    }
  });

  await prisma.operation_log.deleteMany({
    where: {
      create_time: {
        lt: thirtyDaysAgo
      }
    }
  });
}

async function optimizeTables() {
  await prisma.$executeRaw`OPTIMIZE TABLE car_info, cost_management, revenue_management, sale_info`;
}

async function analyzeTables() {
  await prisma.$executeRaw`ANALYZE TABLE car_info, cost_management, revenue_management, sale_info`;
}

async function runMaintenance() {
  try {
    console.log('开始数据库维护任务...');

    // 运行数据库监控
    console.log('运行数据库监控...');
    await monitorDatabase();

    // 清理旧日志
    console.log('清理旧日志...');
    await cleanupOldLogs();

    // 优化表
    console.log('优化数据表...');
    await optimizeTables();

    // 更新统计信息
    console.log('更新统计信息...');
    await analyzeTables();

    console.log('数据库维护任务完成');
  } catch (error) {
    console.error('数据库维护任务失败：', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runMaintenance()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('维护任务失败：', error);
      process.exit(1);
    });
} 