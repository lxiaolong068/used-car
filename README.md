# 二手车辆管理系统

一个基于 Next.js 14 开发的现代化二手车辆管理系统，采用 Serverless 架构，支持 Vercel 一键部署。

## 项目概述

本系统是一个完整的二手车辆管理解决方案，提供从车辆信息管理到成本收益分析的全套功能。采用最新的 Next.js 14 框架开发，具有高性能、可扩展性强的特点。

### 功能特性

- 🚗 **车辆管理**
  - 车辆信息录入与管理
  - 车辆状态追踪
  - 车辆图片管理
  - 车辆检查记录

- 💰 **成本管理**
  - 采购成本记录
  - 维修保养费用
  - 其他支出管理
  - 成本分析报表

- 📊 **收益管理**
  - 销售记录管理
  - 利润计算
  - 收益趋势分析
  - 导出报表

- 👥 **用户权限管理**
  - 多角色权限控制
  - 操作日志记录
  - 数据访问控制
  - 菜单权限状态管理
  - 权限类型分级控制
  - 菜单智能排序

## 技术栈

- **运行环境**: Node.js (推荐 v20.9.0 或更高版本)
- **前端框架**: Next.js 14
- **编程语言**: TypeScript
- **UI 框架**: Tailwind CSS
- **数据库**: Prisma + MySQL
- **状态管理**: SWR
- **认证方案**: JWT (jose)
- **部署平台**: Vercel

## 系统架构

### 前端架构
```
app/
├── components/        # 组件目录
│   ├── common/       # 通用组件
│   └── ui/          # UI 组件
├── contexts/         # 全局状态
├── hooks/           # 自定义 Hooks
└── lib/             # 工具函数
```

### 后端架构
```
├── api/             # API 路由
├── middleware/      # 中间件
│   ├── cache.ts    # 缓存中间件
│   ├── rateLimit.ts # 限流中间件
│   └── auth.ts     # 认证中间件
└── prisma/         # 数据库模型
```

## 部署指南

### Vercel 部署（推荐）

1. **准备工作**
   - 注册 [Vercel 账号](https://vercel.com)
   - 准备好远程 MySQL 数据库
   - Fork 本项目到你的 GitHub 账号

2. **数据库配置**
   - 确保远程 MySQL 数据库允许外部访问
   - 数据库连接字符串格式：
     ```
     mysql://username:password@host:port/database
     ```
   - 数据库用户需要具有以下权限：
     - SELECT, INSERT, UPDATE, DELETE
     - CREATE, ALTER, DROP
     - INDEX
     - REFERENCES

3. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   ```
   DATABASE_URL=mysql://username:password@host:port/database
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   ```

4. **一键部署**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/used-car)

5. **数据库初始化**
   ```bash
   # 本地执行数据库迁移
   npm run prisma:generate
   npm run prisma:push
   ```

### 常见部署问题解决

1. **数据库连接问题**
   - 确保数据库连接字符串格式正确
   - 检查数据库是否允许外部连接
   - 验证数据库用户权限
   - 确保数据库端口（默认3306）开放
   - 检查防火墙设置

2. **环境变量问题**
   - 在 Vercel 控制台中正确设置所有环境变量
   - 确保环境变量名称完全匹配
   - 验证连接字符串中的特殊字符是否正确编码

3. **构建失败问题**
   - 确保 package.json 中的 scripts 包含：
     ```json
     {
       "scripts": {
         "vercel-build": "prisma generate && next build",
         "postinstall": "prisma generate"
       }
     }
     ```
   - 检查 vercel.json 配置：
     ```json
     {
       "version": 2,
       "builds": [
         {
           "src": "package.json",
           "use": "@vercel/next"
         }
       ],
       "framework": "nextjs",
       "buildCommand": "npm run vercel-build",
       "installCommand": "npm install",
       "outputDirectory": ".next",
       "env": {
         "NODE_ENV": "production"
       }
     }
     ```

4. **Prisma 相关问题**
   - 确保 schema.prisma 配置正确：
     ```prisma
     generator client {
       provider = "prisma-client-js"
     }

     datasource db {
       provider = "mysql"
       url      = env("DATABASE_URL")
     }
     ```
   - 执行 Prisma 命令进行故障排除：
     ```bash
     npx prisma generate
     npx prisma db push
     ```

5. **性能优化建议**
   - 使用数据库连接池
   - 配置适当的超时时间
   - 启用数据库查询缓存
   - 使用合适的数据库索引

### 安全建议

1. **数据库安全**
   - 使用强密码
   - 限制数据库用户权限
   - 定期更新数据库密码
   - 配置数据库防火墙规则

2. **环境变量安全**
   - 使用强 JWT 密钥
   - 不同环境使用不同的密钥
   - 定期轮换密钥
   - 避免在代码中硬编码敏感信息

3. **应用安全**
   - 启用 CORS 保护
   - 配置安全响应头
   - 实施速率限制
   - 启用 SQL 注入防护

### 本地开发环境搭建

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/used-car.git
   cd used-car
   ```

2. **安装依赖**
   ```bash
   npm install

   # 安装必要的额外依赖
   npm install @headlessui/react@latest
   npm install jsonwebtoken
   npm install @types/jsonwebtoken --save-dev

   # 更新 Prisma（如果需要）
   npm install prisma@latest @prisma/client@latest
   ```

3. **环境配置**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，配置必要的环境变量
   ```

4. **数据库设置**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 性能优化

### 缓存策略
- API 响应缓存（5分钟）
- 静态资源缓存（7天）
- 菜单状态缓存（15分钟）

### Vercel 优化建议
1. **使用 Vercel KV 存储**
   ```bash
   # 安装 Vercel KV
   npm install @vercel/kv
   ```
   在 Vercel 控制台启用 KV 存储

2. **配置 Edge Functions**
   ```json
   // vercel.json
   {
     "functions": {
       "api/*.ts": {
         "memory": 1024,
         "maxDuration": 10
       }
     }
   }
   ```

3. **使用 Edge Middleware**
   - 速率限制
   - 缓存控制
   - 安全头部

## 监控与维护

### 性能监控
- 使用 Vercel Analytics
- 自定义性能指标收集
- 响应时间监控

### 错误处理
- 统一的错误响应格式
- 详细的错误日志
- 自动告警机制

### 安全措施
- 请求速率限制
- JWT 认证
- SQL 注入防护
- XSS 防护

## 常见问题

### 部署相关
1. **数据库连接问题**
   - 检查数据库连接字符串
   - 确保数据库允许外部连接
   - 验证 IP 白名单设置

2. **环境变量问题**
   - 确保所有必要的环境变量都已设置
   - 检查环境变量格式是否正确
   - 重新部署以应用新的环境变量

3. **性能问题**
   - 检查数据库查询性能
   - 确认缓存策略是否生效
   - 查看 Vercel 部署日志

4. **版本兼容性**
   - 确保所有依赖的版本兼容
   - 检查是否有版本不兼容的依赖
   - 升级或替换不兼容的依赖

## 更新日志

### v0.1.0 (2024-01-28)
- 权限管理功能增强
  - 新增权限状态管理
  - 新增权限类型分级
  - 新增菜单智能排序
  - 优化菜单显示逻辑
  - 提升系统安全性

### v1.0.0 (2024-01-28)
- 初始版本发布
- 基础功能实现
- Vercel 部署支持

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

ISC License

## 联系方式

- 项目维护者：[Your Name]
- Email：[your.email@example.com]
- GitHub：[your-github-username]
 
