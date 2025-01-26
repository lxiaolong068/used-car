const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // 创建基础权限
  const permissions = [
    {
      permission_name: '仪表盘',
      permission_key: 'dashboard',
      permission_type: 'menu',
      path: '/dashboard',
      component: null,
      icon: 'HomeIcon',
      sort_order: 1,
      status: 1,
      parent_id: null
    },
    {
      permission_name: '用户管理',
      permission_key: 'user_manage',
      permission_type: 'menu',
      path: '/dashboard/users',
      component: null,
      icon: 'UsersIcon',
      sort_order: 2,
      status: 1,
      parent_id: null
    },
    {
      permission_name: '角色管理',
      permission_key: 'role_manage',
      permission_type: 'menu',
      path: '/dashboard/roles',
      component: null,
      icon: 'KeyIcon',
      sort_order: 3,
      status: 1,
      parent_id: null
    },
    {
      permission_name: '权限管理',
      permission_key: 'permission_manage',
      permission_type: 'menu',
      path: '/dashboard/permissions',
      component: null,
      icon: 'ShieldCheckIcon',
      sort_order: 4,
      status: 1,
      parent_id: null
    },
    {
      permission_name: '车辆管理',
      permission_key: 'car_manage',
      permission_type: 'menu',
      path: '/dashboard/cars',
      component: null,
      icon: 'TruckIcon',
      sort_order: 5,
      status: 1,
      parent_id: null
    },
    {
      permission_name: '费用管理',
      permission_key: 'cost_manage',
      permission_type: 'menu',
      path: '/dashboard/costs',
      component: null,
      icon: 'CurrencyYenIcon',
      sort_order: 6,
      status: 1,
      parent_id: null
    }
  ]

  try {
    // 清理现有数据（按照正确的顺序）
    console.log('开始清理现有数据...')
    await prisma.role_permission.deleteMany()
    await prisma.user.deleteMany()
    await prisma.permission.deleteMany()
    await prisma.role.deleteMany()
    console.log('数据清理完成')

    // 创建权限
    console.log('开始创建权限...')
    const createdPermissions = []
    for (const permission of permissions) {
      const createdPermission = await prisma.permission.create({
        data: permission
      })
      createdPermissions.push(createdPermission)
    }
    console.log('权限创建完成')

    // 创建超级管理员角色
    console.log('开始创建超级管理员角色...')
    const adminRole = await prisma.role.create({
      data: {
        role_name: '超级管理员',
        role_key: 'super_admin',
        description: '系统超级管理员',
        status: 1
      }
    })
    console.log('超级管理员角色创建完成')

    // 为超级管理员分配所有权限
    console.log('开始分配权限...')
    for (const permission of createdPermissions) {
      await prisma.role_permission.create({
        data: {
          role_id: adminRole.role_id,
          permission_id: permission.permission_id
        }
      })
    }
    console.log('权限分配完成')

    // 创建超级管理员用户
    console.log('开始创建超级管理员用户...')
    const hashedPassword = await bcrypt.hash('123456', 10)
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role_id: adminRole.role_id
      }
    })
    console.log('超级管理员用户创建完成')

    console.log('数据库初始化完成')
  } catch (error) {
    console.error('初始化过程中出错:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
