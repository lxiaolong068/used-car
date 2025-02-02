# Used Car Management System

一个现代化的二手车管理系统，基于 Next.js 和 Tailwind CSS 构建。本系统提供完整的二手车管理功能，包括车辆信息管理、成本管理、收益分析、用户权限控制等功能。

## 🌟 特性

- 🚀 **现代技术栈**
  - 基于 Next.js 14 和 React 18
  - TypeScript 保证代码质量
  - Tailwind CSS 实现灵活样式定制
  
- 💅 **精美 UI 设计**
  - 使用 Radix UI 构建的现代化组件
  - 支持亮色/暗色主题切换
  - 响应式设计，完美适配各种设备
  
- 🔒 **安全可靠**
  - 完整的 RBAC 权限管理系统
  - 细粒度的数据访问控制
  - 详细的操作日志记录
  
- 🌍 **国际化支持**
  - 支持中文、英文等多语言
  - 灵活的语言包扩展机制
  - 自动识别用户语言偏好
  
- 📊 **数据可视化**
  - 直观的数据统计图表
  - 实时数据更新
  - 自定义报表导出
  
- 🔍 **高级搜索**
  - 多条件组合查询
  - 智能过滤和排序
  - 搜索历史记录
  
- 📝 **表单处理**
  - 完整的表单验证
  - 自动保存草稿
  - 分步表单支持
  
- 🚦 **API 管理**
  - RESTful API 设计
  - 自动化的 API 文档
  - 请求速率限制

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14, React 18
- **类型系统**: TypeScript 5
- **样式解决方案**: Tailwind CSS 3
- **组件库**: Radix UI
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod
- **HTTP 客户端**: Axios
- **图表**: Chart.js / D3.js

### 后端
- **API**: Next.js API Routes
- **数据库**: Prisma + PostgreSQL
- **认证**: NextAuth.js
- **缓存**: Redis
- **文件存储**: AWS S3

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **测试**: Jest + React Testing Library
- **文档**: TypeDoc
- **CI/CD**: GitHub Actions

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- pnpm 8+
- Redis 7+ (可选，用于缓存)

### 安装步骤

1. **克隆仓库**
\`\`\`bash
git clone https://github.com/yourusername/used-car.git
cd used-car
\`\`\`

2. **安装依赖**
\`\`\`bash
pnpm install
\`\`\`

3. **环境配置**
\`\`\`bash
cp .env.example .env
\`\`\`

4. **数据库配置**
\`\`\`bash
pnpm prisma generate
pnpm prisma migrate dev
\`\`\`

5. **启动开发服务器**
\`\`\`bash
pnpm dev
\`\`\`

访问 http://localhost:3000 查看应用

## 📦 项目结构

\`\`\`
used-car/
├── app/                # Next.js 应用目录
│   ├── api/           # API 路由
│   ├── (auth)/       # 认证相关页面
│   ├── (dashboard)/  # 主面板页面
│   └── (public)/     # 公开页面
├── components/        # React 组件
│   ├── ui/           # 基础 UI 组件
│   ├── common/       # 通用业务组件
│   └── features/     # 功能模块组件
├── lib/              # 工具函数和配置
│   ├── utils/        # 通用工具函数
│   ├── hooks/        # 自定义 Hooks
│   └── config/       # 配置文件
├── types/            # 类型定义
├── prisma/           # 数据库模型
├── public/           # 静态资源
└── tests/            # 测试文件
\`\`\`

## 📚 文档

- [组件文档](docs/components.md)
- [API 文档](docs/api.md)
- [部署指南](docs/deployment.md)
- [贡献指南](docs/contributing.md)

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
# 单元测试
pnpm test

# E2E 测试
pnpm test:e2e

# 测试覆盖率
pnpm test:coverage
\`\`\`

## 🚢 部署

### Vercel 部署（推荐）

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### Docker 部署

\`\`\`bash
# 构建镜像
docker build -t used-car .

# 运行容器
docker run -p 3000:3000 used-car
\`\`\`

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (\`git checkout -b feature/amazing-feature\`)
3. 提交更改 (\`git commit -m 'feat: add amazing feature'\`)
4. 推送到分支 (\`git push origin feature/amazing-feature\`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

- 产品经理：[Name]
- 技术负责人：[Name]
- 前端开发：[Name]
- 后端开发：[Name]
- UI 设计：[Name]

## 📞 联系方式

- 官方网站：[website]
- 邮箱：[email]
- 微信：[WeChat ID]

## 📝 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)
 
