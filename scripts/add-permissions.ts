import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addPermissions() {
  try {
    // 添加系统管理菜单
    const systemMenu = await prisma.permission.create({
      data: {
        permission_name: '系统管理',
        permission_key: 'system',
        permission_type: 'menu',
        path: '/dashboard/system',
        icon: 'Settings',
        sort_order: 900,
        status: 1,
      },
    });

    // 添加操作日志菜单
    const logsMenu = await prisma.permission.create({
      data: {
        permission_name: '操作日志',
        permission_key: 'operation_logs',
        permission_type: 'menu',
        path: '/dashboard/logs',
        icon: 'FileText',
        sort_order: 920,
        status: 1,
        parent_id: systemMenu.permission_id,
      },
    });

    // 添加查看操作日志权限
    await prisma.permission.create({
      data: {
        permission_name: '查看操作日志',
        permission_key: 'view_operation_logs',
        permission_type: 'action',
        sort_order: 921,
        status: 1,
        parent_id: logsMenu.permission_id,
      },
    });

    console.log('权限添加成功');
  } catch (error) {
    console.error('添加权限失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPermissions(); 