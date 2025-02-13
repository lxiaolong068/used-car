# 二手车管理系统开发规范

## 目录
- [开发环境](#开发环境)
- [项目结构规范](#项目结构规范)
- [代码风格指南](#代码风格指南)
- [认证和路由处理规范](#认证和路由处理规范)
- [Git 工作流规范](#git-工作流规范)
- [文件命名规范](#文件命名规范)
- [开发注意事项](#开发注意事项)

## 开发环境

### 必需的开发工具
- Node.js 18.0+
- Next.js 14
- pnpm 10.0+
- Git 2.0+
- Visual Studio Code
- MySQL

### VSCode 必装扩展
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript and JavaScript Language Features

## 项目结构规范

### 目录结构
\`\`\`
used-car/
├── app/                # Next.js 应用目录
│   ├── api/           # API 路由
│   ├── (auth)/        # 认证相关页面
│   ├── (dashboard)/   # 主面板页面
│   └── (public)/      # 公开页面
├── components/        # React 组件
├── lib/              # 工具函数和配置
├── scripts/          # 脚本文件
├── data/             # SQL 文件
└── docs/             # 项目文档
\`\`\`

### 文件位置规范
1. **脚本文件规范**
   - 所有脚本文件必须放在 `/scripts` 目录下
   - 脚本文件应当按功能分类存放
   - 每个脚本文件都应该有相应的说明注释

2. **SQL 文件规范**
   - 所有 SQL 文件必须放在 `/data` 目录下
   - SQL 文件命名应该清晰表明其用途
   - 每个 SQL 文件都应该有相应的说明注释

3. **组件规范**
   - 基础 UI 组件放在 `components/ui` 目录
   - 业务组件放在 `components/features` 目录
   - 通用组件放在 `components/common` 目录

## 代码风格指南

### 通用规范

1. **接口设计规范**
   - 在开发过程中，除非用户明确要求，否则应保持现有的界面、样式和布局
   - 所有的UI变更都需要经过确认
   - 保持界面的一致性和可预测性

2. **代码格式化**
   - 使用项目配置的 ESLint 和 Prettier 规则
   - 保存时自动格式化
   - 提交前强制代码检查

3. **命名规范**
   - 组件使用 PascalCase
   - 函数和变量使用 camelCase
   - 常量使用 UPPER_SNAKE_CASE
   - 类型和接口使用 PascalCase

## 认证和路由处理规范

### 1. 表单处理规范
- **表单默认行为**
  - 必须使用 `e.preventDefault()` 阻止表单默认提交行为
  - 不要在表单上设置 `action` 和 `method` 属性
  - 使用 `onSubmit` 处理表单提交
  - 使用受控组件管理表单状态

- **错误处理**
  - 在提交前进行客户端表单验证
  - 显示清晰的错误信息
  - 禁用提交按钮直到验证通过

### 2. NextAuth 配置规范
- **认证选项**
  - 保持 `authOptions` 配置的一致性
  - 使用 `redirect: false` 控制重定向行为
  - 在登录成功后手动处理重定向
  - 不要在 URL 中暴露敏感信息

- **会话处理**
  - 使用 JWT 策略管理会话
  - 设置合适的会话过期时间
  - 正确处理会话刷新

### 3. 路由保护规范
- **中间件配置**
  - 使用中间件统一处理路由保护
  - 明确定义公共路径和受保护路径
  - 避免循环重定向
  - 正确处理 API 路由的认证

- **重定向处理**
  - 使用 `router.replace` 而不是 `router.push`
  - 检查回调 URL 的合法性
  - 避免重定向到登录页面时携带敏感信息

### 4. 开发调试规范
- **修改认证代码后的操作**
  - 清除浏览器的 cookie 和缓存
  - 重启开发服务器
  - 测试所有可能的认证场景
  - 检查 Network 面板中的请求

- **常见问题排查**
  - 检查环境变量配置
  - 验证数据库连接
  - 查看服务器日志
  - 确认中间件配置正确

### 5. 认证日志规范
- **认证日志**
  - 记录所有认证相关事件
  - 包括登录、登出、会话刷新等
  - 使用日志记录认证相关错误

### 6. 认证测试规范
- **单元测试**
  - 编写单元测试覆盖认证相关代码
  - 使用 Jest 和 React Testing Library
  - 测试认证相关函数和组件

- **集成测试**
  - 编写集成测试覆盖认证相关流程
  - 使用 Cypress 和 Playwright
  - 测试认证相关页面和 API

## Git 工作流规范

### 分支管理
- `main`: 主分支，用于生产环境
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支

### 提交信息规范

\`\`\`
<type>(<scope>): <subject>

<body>
\`\`\`

类型（type）：
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

示例：
\`\`\`bash
feat(auth): add login form validation
fix(auth): resolve login redirect issue
docs(auth): update authentication guide
\`\`\`

### 代码审查清单
- [ ] 代码是否遵循项目规范
- [ ] 是否有适当的错误处理
- [ ] 是否有必要的注释
- [ ] 是否有适当的测试覆盖
- [ ] 是否有性能问题
- [ ] 是否有安全隐患

## 文件命名规范

### 组件文件
- 使用 PascalCase
- 例如：`UserCard.tsx`, `DataTable.tsx`

### 工具函数文件
- 使用 camelCase
- 例如：`formatDate.ts`, `validateInput.ts`

### 样式文件
- 使用 camelCase
- 例如：`styles.module.css`, `theme.css`

### 测试文件
- 使用原文件名加 `.test` 或 `.spec`
- 例如：`UserCard.test.tsx`, `formatDate.spec.ts`

## 开发注意事项

### 1. 开发环境相关
- 本项目开发环境为 Windows
- 部署平台为 Vercel
- 所有开发和部署流程都应该与此环境兼容

### 2. 性能优化
- 使用适当的代码分割
- 优化图片和资源加载
- 实现适当的缓存策略
- 注意代码包大小

### 3. 安全性
- 所有的用户输入都必须验证
- 使用适当的权限控制
- 保护敏感信息
- 使用 HTTPS

### 4. 可访问性
- 遵循 WCAG 2.1 指南
- 使用语义化 HTML
- 提供适当的 ARIA 标签
- 确保键盘可访问性

### 5. 国际化
- 使用 i18n 进行文本管理
- 考虑不同语言的布局影响
- 使用 Unicode 字符集

### 6. 测试
- 编写单元测试
- 进行集成测试
- 执行端到端测试
- 进行性能测试

### 7. 文档
- 及时更新文档
- 添加适当的代码注释
- 记录 API 变更
- 维护更新日志