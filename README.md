# Used Car Management System (二手车管理系统)

## 📖 项目介绍

一个基于 Next.js 14 和 React 18 构建的现代化二手车管理系统。本系统提供完整的二手车销售管理解决方案，包括车辆信息管理、成本管理、收益分析、用户权限控制等功能。

### 🎯 主要功能

#### 1. 车辆管理
- 车辆基本信息管理（VIN码、车型、里程数等）
- 车辆状态跟踪（在库、已售、维修中等）
- 车辆图片管理
- 车辆历史记录

#### 2. 成本管理
- 采购成本记录
- 维修保养成本
- 其他相关支出
- 成本分析报表

#### 3. 收益管理
- 销售收入记录
- 收益分析
- 利润计算
- 财务报表生成

#### 4. 客户管理
- 客户信息管理
- 意向客户跟踪
- 客户关系维护
- 客户档案管理

#### 5. 系统管理
- 用户权限管理
- 角色管理
- 操作日志
- 系统配置

## 🛠️ 技术架构

### 前端技术栈
| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 14.x | React 框架 |
| React | 18.x | 用户界面库 |
| TypeScript | 5.x | 类型系统 |
| Tailwind CSS | 3.x | 样式解决方案 |
| Radix UI | 1.x | 无障碍组件库 |
| Zustand | 4.x | 状态管理 |
| React Hook Form | 7.x | 表单处理 |
| Zod | 3.x | 数据验证 |
| Axios | 1.x | HTTP 客户端 |
| Chart.js/D3.js | 4.x | 数据可视化 |

### 后端技术栈
| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js API Routes | 14.x | API 路由 |
| Prisma | 6.x | ORM 框架 |
| PostgreSQL | 14.x | 数据库 |
| NextAuth.js | 4.x | 认证框架 |
| Redis | 7.x | 缓存服务 |
| AWS S3 | - | 文件存储 |

### 开发工具
| 工具 | 版本 | 说明 |
|------|------|------|
| pnpm | 8.x | 包管理器 |
| ESLint | 8.x | 代码检查 |
| Prettier | 3.x | 代码格式化 |
| Jest | 29.x | 单元测试 |
| React Testing Library | 14.x | 组件测试 |
| TypeDoc | 0.24.x | 文档生成 |
| GitHub Actions | - | CI/CD |

## 📦 系统要求

- Node.js 18.0 或更高版本
- PostgreSQL 14.0 或更高版本
- pnpm 8.0 或更高版本
- Redis 7.0 或更高版本 (可选，用于缓存)

## 🚀 快速开始

### 1. 克隆项目
\`\`\`bash
git clone https://github.com/yourusername/used-car.git
cd used-car
\`\`\`

### 2. 安装依赖
\`\`\`bash
pnpm install
\`\`\`

### 3. 环境配置
复制环境变量配置文件：
\`\`\`bash
cp .env.example .env
\`\`\`

配置必要的环境变量：
\`\`\`env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/used_car"

# JWT 配置
JWT_SECRET="your-jwt-secret"

# Redis 配置（可选）
REDIS_URL="redis://localhost:6379"

# AWS S3 配置（可选）
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
AWS_BUCKET_NAME="your-bucket-name"
\`\`\`

### 4. 数据库迁移
\`\`\`bash
# 生成 Prisma 客户端
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate dev
\`\`\`

### 5. 启动开发服务器
\`\`\`bash
pnpm dev
\`\`\`

访问 http://localhost:3000 查看应用。

## 📁 项目结构

\`\`\`
used-car/
├── app/                # Next.js 应用目录
│   ├── api/           # API 路由
│   │   ├── auth/      # 认证相关 API
│   │   ├── cars/      # 车辆相关 API
│   │   └── users/     # 用户相关 API
│   ├── (auth)/        # 认证相关页面
│   ├── (dashboard)/   # 主面板页面
│   └── (public)/      # 公开页面
├── components/         # React 组件
│   ├── ui/            # 基础 UI 组件
│   ├── common/        # 通用业务组件
│   └── features/      # 功能模块组件
├── lib/               # 工具函数和配置
│   ├── utils/         # 通用工具函数
│   ├── hooks/         # 自定义 Hooks
│   └── config/        # 配置文件
├── types/             # 类型定义
├── prisma/            # 数据库模型
├── public/            # 静态资源
└── tests/             # 测试文件
\`\`\`

## 📚 API 文档

### RESTful API
- 基础路径：`/api`
- 认证：使用 JWT Token
- 详细文档：访问 `/api-docs` (开发环境)

### WebSocket API
- 基础路径：`/ws`
- 用于实时通知和数据更新

## 🔧 开发指南

### 代码规范
\`\`\`bash
# 检查代码
pnpm lint

# 格式化代码
pnpm format

# 类型检查
pnpm type-check
\`\`\`

### 测试
\`\`\`bash
# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e

# 查看测试覆盖率
pnpm test:coverage
\`\`\`

### Git 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档变更
- style: 代码格式
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 🚢 部署指南

### Vercel 部署（推荐）

#### 前期准备
1. 注册 [Vercel](https://vercel.com) 账号并关联 GitHub
2. 准备好 PostgreSQL 数据库（推荐使用 [Supabase](https://supabase.com/)）
3. 准备好必要的环境变量

#### 部署步骤

1. **导入项目到 Vercel**
   - 登录 [Vercel 控制台](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

2. **配置构建设置**
   
   在项目配置页面中：
   - Framework Preset: 选择 "Next.js"
   - Build Command: 修改为 `pnpm install --no-frozen-lockfile && prisma generate && next build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

3. **配置环境变量**
   
   在 "Environment Variables" 部分添加：
   ```
   # 数据库配置（必需）
   DATABASE_URL=postgresql://username:password@host:5432/database

   # JWT 配置（必需）
   JWT_SECRET=your-secure-jwt-secret

   # Next.js 配置（必需）
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret
   NODE_ENV=production
   ```

4. **数据库迁移**
   
   首次部署前需要执行数据库迁移：
   ```bash
   # 本地执行
   pnpm prisma migrate deploy
   ```

5. **检查部署**
   - 确保所有环境变量已正确配置
   - 点击 "Deploy" 开始部署
   - 等待部署完成并检查构建日志

#### 常见部署问题

1. **依赖安装失败**
   - 问题：pnpm install 报错
   - 解决：在构建命令中添加 `--no-frozen-lockfile` 选项

2. **数据库连接失败**
   - 问题：无法连接数据库
   - 解决：
     - 检查 DATABASE_URL 格式
     - 确保数据库允许 Vercel IP 访问
     - 验证数据库凭据

3. **Prisma 生成失败**
   - 问题：prisma generate 报错
   - 解决：确保构建命令中包含 `prisma generate`

4. **构建超时**
   - 问题：部署时间过长导致超时
   - 解决：
     - 优化依赖安装
     - 检查构建缓存配置
     - 考虑使用 Turborepo

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

- 产品负责人：[Name] - [email]
- 技术负责人：[Name] - [email]
- 前端开发：[Name] - [email]
- 后端开发：[Name] - [email]
- UI 设计：[Name] - [email]

## 📞 联系方式

- 官方网站：[website]
- 技术支持：[email]
- 商务合作：[email]
- 微信：[WeChat ID]

## 📝 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)

## 🙋 常见问题

### Q: 如何添加新的车辆信息？
A: 在管理后台的"车辆管理"页面点击"添加车辆"按钮，填写相关信息即可。

### Q: 如何处理权限问题？
A: 系统采用 RBAC 权限模型，可以在"系统管理"中的"角色管理"配置相应权限。

### Q: 如何备份数据？
A: 系统支持手动和自动备份，可在"系统设置"中配置备份策略。

## 🎯 开发路线图

- [x] 基础框架搭建
- [x] 用户认证系统
- [x] 车辆管理模块
- [x] 成本管理模块
- [ ] 客户管理模块
- [ ] 数据分析模块
- [ ] 移动端适配
- [ ] 国际化支持

## 🌟 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
 
