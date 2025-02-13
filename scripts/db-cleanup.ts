const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDatabase() {
  try {
    console.log('开始数据库清理任务...');

    // 清理 30 天前的错误日志
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedErrorLogs = await prisma.errorLog.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo
        }
      }
    });
    console.log(`已清理 ${deletedErrorLogs.count} 条错误日志`);

    // 清理 30 天前的操作日志
    const deletedOperationLogs = await prisma.operation_log.deleteMany({
      where: {
        create_time: {
          lt: thirtyDaysAgo
        }
      }
    });
    console.log(`已清理 ${deletedOperationLogs.count} 条操作日志`);

    // 优化表
    console.log('优化数据表...');
    await prisma.$executeRaw`OPTIMIZE TABLE car_info, cost_management, revenue_management, sale_info`;

    // 更新统计信息
    console.log('更新统计信息...');
    await prisma.$executeRaw`ANALYZE TABLE car_info, cost_management, revenue_management, sale_info`;

    // 清理查询缓存
    console.log('清理查询缓存...');
    await prisma.$executeRaw`RESET QUERY CACHE`;
    await prisma.$executeRaw`FLUSH QUERY CACHE`;

    // 整理 InnoDB 表空间
    console.log('整理表空间...');
    await prisma.$executeRaw`SET GLOBAL innodb_file_per_table=1`;
    await prisma.$executeRaw`ALTER TABLE car_info ENGINE=InnoDB`;
    await prisma.$executeRaw`ALTER TABLE cost_management ENGINE=InnoDB`;
    await prisma.$executeRaw`ALTER TABLE revenue_management ENGINE=InnoDB`;
    await prisma.$executeRaw`ALTER TABLE sale_info ENGINE=InnoDB`;

    console.log('数据库清理任务完成');

    return {
      success: true,
      deletedErrorLogs: deletedErrorLogs.count,
      deletedOperationLogs: deletedOperationLogs.count,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('数据库清理失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  cleanupDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('清理失败:', error);
      process.exit(1);
    });
}

module.exports = { cleanupDatabase }; 