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
| SWR | 2.x | 数据请求 |
| React Hook Form | 7.x | 表单处理 |
| React Hot Toast | 2.x | 提示消息 |

### 后端技术栈
| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js API Routes | 14.x | API 路由 |
| Prisma | 6.x | ORM 框架 |
| PostgreSQL | 14.x | 数据库 |
| JWT | 9.x | 认证框架 |
| bcryptjs | 2.x | 密码加密 |

### 开发工具
| 工具 | 版本 | 说明 |
|------|------|------|
| pnpm | 10.x | 包管理器 |
| ESLint | 8.x | 代码检查 |
| Prettier | 3.x | 代码格式化 |
| Husky | 9.x | Git Hooks |
| lint-staged | 15.x | 提交前检查 |

## 📦 系统要求

- Node.js 18.0 或更高版本
- PostgreSQL 14.0 或更高版本
- pnpm 10.0 或更高版本
- Git 2.0 或更高版本

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
\`\`\`

### 4. 数据库迁移
\`\`\`bash
# 生成 Prisma 客户端
pnpm prisma generate

# 运行数据库迁移
pnpm prisma db push

# 运行数据填充（可选）
pnpm seed
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
├── prisma/            # 数据库模型和迁移
├── public/            # 静态资源
└── types/             # TypeScript 类型定义
\`\`\`

## 💻 开发指南

### 代码规范

本项目使用 ESLint 和 Prettier 进行代码规范和格式化。

#### 可用的命令：

\`\`\`bash
# 代码检查
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:fix

# 格式化代码
pnpm format

# 类型检查
pnpm type-check
\`\`\`

### Git 提交规范

本项目使用 Husky 和 lint-staged 来确保代码质量。每次提交前会自动运行以下检查：

- ESLint 检查
- Prettier 格式化
- TypeScript 类型检查

提交信息格式：
\`\`\`
<type>(<scope>): <subject>

<body>
\`\`\`

类型（type）：
- feat: 新功能
- fix: 修复问题
- docs: 文档变更
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动

### VSCode 配置

本项目包含推荐的 VSCode 配置和扩展。

#### 推荐的扩展：

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Code Spell Checker
- Color Highlight
- DotENV
- ES7+ React/Redux/React-Native snippets
- Import Cost
- Path Intellisense
- Pretty TypeScript Errors

#### 工作区设置：

项目已包含 VSCode 工作区设置，主要配置：

- 保存时自动格式化
- ESLint 自动修复
- Prettier 作为默认格式化工具
- TypeScript 路径提示
- Tailwind CSS 智能提示

### 数据库维护与优化

本项目提供了一系列数据库维护和优化工具，位于 `scripts` 目录下：

#### 1. 数据库优化
执行以下命令来优化数据库性能：
```bash
# 运行数据库优化
pnpm db:optimize
```
优化内容包括：
- 添加必要的索引
- 更新表统计信息
- 优化表结构
- 配置查询缓存
- 设置 InnoDB 缓冲池

#### 2. 数据库监控
监控数据库性能和健康状况：
```bash
# 运行数据库监控
pnpm db:monitor

# 仅分析不保存监控数据
pnpm db:analyze
```
监控指标包括：
- 表大小和行数统计
- 查询缓存命中率
- 缓冲池使用情况
- 性能警告阈值检查

监控数据将保存在 `metrics` 目录下，格式为 JSON。

#### 3. 数据库维护
定期维护任务：
```bash
# 运行维护任务
pnpm db:maintenance

# 清理过期数据和日志
pnpm db:cleanup
```

#### 4. 数据库备份
```bash
# 创建数据库备份
pnpm db:backup
```

### 性能优化建议

1. 定期运行 `pnpm db:optimize` 以保持数据库性能
2. 监控 `metrics` 目录下的性能报告
3. 当查询缓存命中率低于 80% 时，考虑：
   - 检查是否有频繁的数据更新操作
   - 优化查询语句
   - 调整缓存配置参数
4. 当表大小超过 1GB 时，考虑：
   - 实施数据归档策略
   - 优化索引结构
   - 进行表分区

## 🚢 部署

### Vercel 部署（推荐）

1. Fork 本项目到你的 GitHub 账号

2. 在 Vercel 中导入项目：
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择你 fork 的仓库
   - 点击 "Import"

3. 配置环境变量：
   - DATABASE_URL
   - JWT_SECRET
   - NODE_ENV=production

4. 部署项目：
   - 点击 "Deploy"
   - 等待部署完成

### 手动部署

1. 构建项目：
\`\`\`bash
pnpm build
\`\`\`

2. 启动生产服务器：
\`\`\`bash
pnpm start
\`\`\`

## 📝 许可证

本项目采用 [ISC 许可证](LICENSE)。

## 🤝 贡献指南

1. Fork 本项目
2. 创建你的特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交你的更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 打开一个 Pull Request

## 📮 联系方式

如有任何问题或建议，欢迎提出 Issue 或 Pull Request。

## 📄 更新日志

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
 
