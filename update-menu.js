const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateMenuNames() {
  try {
    // 更新仪表盘
    await prisma.permission.update({
      where: { permission_key: 'dashboard' },
      data: { permission_name: '仪表盘' }
    })

    // 更新用户管理
    await prisma.permission.update({
      where: { permission_key: 'user_manage' },
      data: { permission_name: '用户管理' }
    })

    // 更新角色管理
    await prisma.permission.update({
      where: { permission_key: 'role_manage' },
      data: { permission_name: '角色管理' }
    })

    // 更新权限管理
    await prisma.permission.update({
      where: { permission_key: 'permission_manage' },
      data: { permission_name: '权限管理' }
    })

    // 更新车辆管理
    await prisma.permission.update({
      where: { permission_key: 'car_manage' },
      data: { permission_name: '车辆管理' }
    })

    // 更新费用管理
    await prisma.permission.update({
      where: { permission_key: 'cost_manage' },
      data: { permission_name: '费用管理' }
    })

    // 更新收入管理
    await prisma.permission.update({
      where: { permission_key: 'revenue_management' },
      data: { permission_name: '收入管理' }
    })

    console.log('菜单名称更新成功')
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateMenuNames() 