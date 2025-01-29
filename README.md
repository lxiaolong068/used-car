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

## 技术栈

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
   - 准备好 MySQL 数据库（推荐使用 PlanetScale）
   - Fork 本项目到你的 GitHub 账号

2. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   ```
   DATABASE_URL=your_mysql_connection_string
   JWT_SECRET=your_jwt_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_nextauth_secret
   NODE_ENV=production
   PRISMA_GENERATE_DATAPROXY=true
   ```

3. **一键部署**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/used-car)

4. **数据库迁移**
   ```bash
   # 本地执行数据库迁移
   npm run prisma:generate
   npm run prisma:push
   ```

5. **验证部署**
   - 访问你的 Vercel 域名
   - 检查所有功能是否正常
   - 查看环境变量是否生效

### 常见部署问题解决

1. **依赖相关错误**
   如果遇到 "Module not found" 错误，请确保以下依赖已正确安装：
   ```bash
   npm install @headlessui/react jsonwebtoken
   npm install --save-dev @types/jsonwebtoken
   ```

2. **Prisma 相关问题**
   - 如果看到 Prisma 版本更新提示，可以选择更新到最新版本：
     ```bash
     npm install prisma@latest @prisma/client@latest
     ```
   - 或者保持当前版本，忽略警告（不影响功能）

3. **构建失败问题**
   - 确保 package.json 中的 scripts 包含：
     ```json
     {
       "scripts": {
         "vercel-build": "prisma generate && next build"
       }
     }
     ```
   - 检查 vercel.json 配置是否正确：
     ```json
     {
       "buildCommand": "npm run vercel-build",
       "env": {
         "PRISMA_GENERATE_DATAPROXY": "true",
         "NODE_ENV": "production"
       }
     }
     ```

4. **数据库连接问题**
   - 确保数据库连接字符串格式正确
   - 检查数据库是否允许外部连接
   - 验证 IP 白名单设置

5. **性能优化建议**
   - 启用 Vercel Edge Functions
   - 配置适当的缓存策略
   - 使用 Vercel KV 存储

### 本地开发环境搭建

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/used-car.git
   cd used-car
   ```

2. **安装依赖**
   ```bash
   npm install
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

## 更新日志

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
 
