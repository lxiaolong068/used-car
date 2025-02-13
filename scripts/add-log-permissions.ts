import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addLogPermissions() {
  try {
    // 获取超级管理员角色
    const superAdminRole = await prisma.role.findFirst({
      where: {
        role_key: 'super_admin'
      }
    });

    if (!superAdminRole) {
      console.error('未找到超级管理员角色');
      return;
    }

    // 获取系统管理菜单权限
    const systemMenu = await prisma.permission.findFirst({
      where: {
        permission_key: 'system'
      }
    });

    // 获取操作日志菜单权限
    const logsMenu = await prisma.permission.findFirst({
      where: {
        permission_key: 'operation_logs'
      }
    });

    // 获取查看操作日志权限
    const viewLogsPermission = await prisma.permission.findFirst({
      where: {
        permission_key: 'view_operation_logs'
      }
    });

    // 为超级管理员添加系统管理菜单权限
    if (systemMenu) {
      await prisma.role_permission.upsert({
        where: {
          role_id_permission_id: {
            role_id: superAdminRole.role_id,
            permission_id: systemMenu.permission_id
          }
        },
        create: {
          role_id: superAdminRole.role_id,
          permission_id: systemMenu.permission_id
        },
        update: {}
      });
    }

    // 为超级管理员添加操作日志菜单权限
    if (logsMenu) {
      await prisma.role_permission.upsert({
        where: {
          role_id_permission_id: {
            role_id: superAdminRole.role_id,
            permission_id: logsMenu.permission_id
          }
        },
        create: {
          role_id: superAdminRole.role_id,
          permission_id: logsMenu.permission_id
        },
        update: {}
      });
    }

    // 为超级管理员添加查看操作日志权限
    if (viewLogsPermission) {
      await prisma.role_permission.upsert({
        where: {
          role_id_permission_id: {
            role_id: superAdminRole.role_id,
            permission_id: viewLogsPermission.permission_id
          }
        },
        create: {
          role_id: superAdminRole.role_id,
          permission_id: viewLogsPermission.permission_id
        },
        update: {}
      });
    }

    console.log('操作日志权限添加成功');
  } catch (error) {
    console.error('添加操作日志权限失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addLogPermissions(); 