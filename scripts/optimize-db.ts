import { PrismaClient } from '@prisma/client';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function optimizeDatabase() {
  try {
    console.log('开始数据库优化...');

    // 1. 添加车辆信息表索引
    console.log('优化车辆信息表...');
    await prisma.$transaction([
      // 车辆信息表索引
      prisma.$executeRaw`ALTER TABLE car_info ADD INDEX idx_sale_status_create_time (sale_status, create_time)`,
      prisma.$executeRaw`ALTER TABLE car_info ADD INDEX idx_model_status (vehicle_model, sale_status)`,
      prisma.$executeRaw`ALTER TABLE car_info ADD INDEX idx_dates (register_date, purchase_date, sale_date)`,

      // 成本管理表索引
      prisma.$executeRaw`ALTER TABLE cost_management ADD INDEX idx_vehicle_payment (vehicle_id, payment_date)`,
      prisma.$executeRaw`ALTER TABLE cost_management ADD INDEX idx_payment_phase_date (payment_phase, payment_date)`,
      prisma.$executeRaw`ALTER TABLE cost_management ADD INDEX idx_create_time (create_time)`,

      // 收入管理表索引
      prisma.$executeRaw`ALTER TABLE revenue_management ADD INDEX idx_vehicle_payment_rev (vehicle_id, payment_date)`,
      prisma.$executeRaw`ALTER TABLE revenue_management ADD INDEX idx_revenue_phase_date (revenue_phase, payment_date)`,
      prisma.$executeRaw`ALTER TABLE revenue_management ADD INDEX idx_create_time_rev (create_time)`,

      // 销售信息表索引
      prisma.$executeRaw`ALTER TABLE sale_info ADD INDEX idx_sale_date_type (sale_date, payment_type)`,
      prisma.$executeRaw`ALTER TABLE sale_info ADD INDEX idx_create_time_sale (create_time)`,

      // 操作日志表索引
      prisma.$executeRaw`ALTER TABLE operation_log ADD INDEX idx_action_create_time (action_type, create_time)`,
      prisma.$executeRaw`ALTER TABLE operation_log ADD INDEX idx_user_action (user_id, action_type)`,

      // 错误日志表索引
      prisma.$executeRaw`ALTER TABLE error_logs ADD INDEX idx_error_timestamp (errorName, timestamp)`,
      prisma.$executeRaw`ALTER TABLE error_logs ADD INDEX idx_user_timestamp (userId, timestamp)`
    ]).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === 'P2010' && error.meta?.code === '1061') {
        console.log('部分索引已存在，继续执行...');
      } else {
        throw error;
      }
    });

    // 2. 更新表统计信息
    console.log('更新表统计信息...');
    await prisma.$executeRaw`ANALYZE TABLE car_info, cost_management, revenue_management, sale_info, operation_log, error_logs`;

    // 3. 优化表
    console.log('优化表结构...');
    await prisma.$executeRaw`OPTIMIZE TABLE car_info, cost_management, revenue_management, sale_info`;

    // 4. 设置数据库参数
    console.log('配置数据库参数...');
    try {
      await prisma.$executeRaw`SET GLOBAL query_cache_size = 67108864`; // 64MB
      await prisma.$executeRaw`SET GLOBAL query_cache_type = 1`;
      await prisma.$executeRaw`SET GLOBAL query_cache_limit = 2097152`; // 2MB
      await prisma.$executeRaw`SET GLOBAL innodb_buffer_pool_size = 1073741824`; // 1GB
      await prisma.$executeRaw`SET GLOBAL optimizer_switch='index_merge=on,index_merge_union=on,index_merge_sort_union=on,index_merge_intersection=on'`;
    } catch (error) {
      console.warn('设置全局参数需要管理员权限，已跳过：', error);
    }

    // 5. 设置慢查询日志
    console.log('配置慢查询日志...');
    try {
      await prisma.$executeRaw`SET GLOBAL slow_query_log = 1`;
      await prisma.$executeRaw`SET GLOBAL long_query_time = 2`;
    } catch (error) {
      console.warn('设置慢查询日志需要管理员权限，已跳过：', error);
    }

    console.log('数据库优化完成');
    return true;
  } catch (error) {
    console.error('数据库优化失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  optimizeDatabase()
    .then(() => {
      console.log('优化成功');
      process.exit(0);
    })
    .catch(error => {
      console.error('优化失败:', error);
      process.exit(1);
    });
}

export { optimizeDatabase }; 