const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash('123456', saltRounds)

  try {
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        role: 'admin'
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      }
    })
    console.log('管理员账号创建成功:', admin)
  } catch (error) {
    console.error('创建管理员账号失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
