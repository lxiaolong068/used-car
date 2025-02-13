import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    // 创建备份目录
    const backupDir = join(process.cwd(), 'backups');
    await mkdir(backupDir, { recursive: true });

    // 生成备份文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = join(backupDir, `backup-${timestamp}.json`);

    // 获取所有表的数据
    const [
      carInfo,
      costManagement,
      revenueManagement,
      saleInfo,
      operationLog,
      errorLogs,
      users,
      roles,
      permissions,
      rolePermissions
    ] = await Promise.all([
      prisma.car_info.findMany(),
      prisma.cost_management.findMany(),
      prisma.revenue_management.findMany(),
      prisma.sale_info.findMany(),
      prisma.operation_log.findMany(),
      prisma.errorLog.findMany(),
      prisma.user.findMany(),
      prisma.role.findMany(),
      prisma.permission.findMany(),
      prisma.role_permission.findMany()
    ]);

    // 创建备份数据对象
    const backupData = {
      timestamp: new Date(),
      tables: {
        car_info: carInfo,
        cost_management: costManagement,
        revenue_management: revenueManagement,
        sale_info: saleInfo,
        operation_log: operationLog,
        error_logs: errorLogs,
        users,
        roles,
        permissions,
        role_permissions: rolePermissions
      }
    };

    // 保存备份文件
    await writeFile(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`备份完成，文件保存在: ${backupFile}`);

    // 清理旧备份文件（保留最近7天的）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 注意：这里不再使用 find 命令，因为它在 Windows 上不可用
    // 实际项目中，你可能需要实现一个跨平台的文件清理功能

    return {
      success: true,
      backupPath: backupFile,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('备份失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  backupDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('备份失败:', error);
      process.exit(1);
    });
}

export { backupDatabase }; 