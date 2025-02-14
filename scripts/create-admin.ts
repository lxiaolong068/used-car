import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // 创建管理员角色
    const adminRole = await prisma.role.upsert({
      where: { role_key: 'admin' },
      update: {},
      create: {
        role_name: '管理员',
        role_key: 'admin',
        description: '系统管理员',
        status: 1
      }
    });

    console.log('Admin role created:', adminRole);

    // 创建管理员用户
    const hashedPassword = await hash('123456', 10);
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        role: {
          connect: {
            role_id: adminRole.role_id
          }
        }
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        role: {
          connect: {
            role_id: adminRole.role_id
          }
        }
      }
    });

    console.log('Admin user created:', {
      user_id: adminUser.user_id,
      username: adminUser.username,
      role_id: adminUser.role_id
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
