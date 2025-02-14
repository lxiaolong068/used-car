import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

const API_DIR = path.join(process.cwd(), 'app', 'api')

async function updateApiRoutes() {
  try {
    // 获取所有的 route.ts 文件
    const files = await glob('**/*route.ts', {
      cwd: API_DIR,
      absolute: true,
    })

    // 排除 auth 相关的路由
    const filesToUpdate = files.filter(file => !file.includes('api\\auth'))

    for (const file of filesToUpdate) {
      console.log(`正在处理: ${file}`)
      
      let content = fs.readFileSync(file, 'utf8')
      
      // 替换导入语句
      if (content.includes("import { verifyUser }")) {
        content = content.replace(
          "import { verifyUser } from '@/lib/auth'",
          "import { getServerSession } from 'next-auth'\nimport { authOptions } from '@/lib/auth'"
        )
      }
      
      // 替换验证逻辑
      content = content.replace(
        /const user = await verifyUser\(\)[^}]*if \(!user\) {[^}]*return NextResponse\.json\([^}]*\}\)/gs,
        `const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }`
      )
      
      // 替换用户引用
      content = content.replace(/user\.id/g, 'session.user.id')
      content = content.replace(/user\.username/g, 'session.user.name')
      content = content.replace(/user\.role/g, 'session.user.role')
      
      // 格式化错误响应
      content = content.replace(
        /return NextResponse\.json\({ error: ([^}]+) }, { status: (\d+) }\)/g,
        'return NextResponse.json(\n      { error: $1 },\n      { status: $2 }\n    )'
      )
      
      fs.writeFileSync(file, content, 'utf8')
      console.log(`已更新: ${file}`)
    }
    
    console.log('所有 API 路由已更新完成')
  } catch (error) {
    console.error('更新失败:', error)
  }
}

updateApiRoutes()
