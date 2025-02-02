# 组件文档

本文档详细介绍了项目中所有可用的组件及其用法。

## 目录

- [表单组件](#表单组件)
  - [Input 输入框](#input-输入框)
  - [Textarea 文本域](#textarea-文本域)
  - [Select 选择框](#select-选择框)
  - [Checkbox 复选框](#checkbox-复选框)
  - [Switch 开关](#switch-开关)
  - [RadioGroup 单选框组](#radiogroup-单选框组)
  - [Label 标签](#label-标签)
- [布局组件](#布局组件)
  - [Card 卡片](#card-卡片)
  - [Separator 分隔线](#separator-分隔线)
- [导航组件](#导航组件)
  - [Tabs 标签页](#tabs-标签页)
  - [Accordion 手风琴](#accordion-手风琴)
- [反馈组件](#反馈组件)
  - [Dialog 对话框](#dialog-对话框)
  - [Tooltip 工具提示](#tooltip-工具提示)
  - [Popover 弹出框](#popover-弹出框)
- [数据展示](#数据展示)
  - [Avatar 头像](#avatar-头像)
  - [Badge 徽章](#badge-徽章)
  - [Skeleton 骨架屏](#skeleton-骨架屏)
- [其他](#其他)
  - [Button 按钮](#button-按钮)
  - [DropdownMenu 下拉菜单](#dropdownmenu-下拉菜单)
  - [Collapsible 折叠面板](#collapsible-折叠面板)

## 表单组件

### Input 输入框

基础的表单输入组件。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| error | string | - | 错误信息 |
| label | string | - | 标签文本 |
| wrapperClassName | string | - | 外层容器类名 |
| labelClassName | string | - | 标签类名 |
| errorClassName | string | - | 错误信息类名 |
| leftIcon | ReactNode | - | 左侧图标 |
| rightIcon | ReactNode | - | 右侧图标 |
| leftIconClassName | string | - | 左侧图标类名 |
| rightIconClassName | string | - | 右侧图标类名 |

#### 示例

\`\`\`tsx
<Input
  label="用户名"
  placeholder="请输入用户名"
  error="用户名不能为空"
  leftIcon={<UserIcon className="h-4 w-4" />}
/>

<Input
  type="password"
  label="密码"
  placeholder="请输入密码"
/>
\`\`\`

### Textarea 文本域

多行文本输入组件。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| error | string | - | 错误信息 |
| label | string | - | 标签文本 |
| wrapperClassName | string | - | 外层容器类名 |
| labelClassName | string | - | 标签类名 |
| errorClassName | string | - | 错误信息类名 |

#### 示例

\`\`\`tsx
<Textarea
  label="描述"
  placeholder="请输入描述"
  error="描述不能为空"
/>
\`\`\`

### Label 标签

表单标签组件。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| variant | 'default' \| 'error' \| 'success' \| 'warning' | 'default' | 标签样式变体 |

#### 示例

\`\`\`tsx
<Label variant="error">错误标签</Label>
<Label variant="success">成功标签</Label>
\`\`\`

## 布局组件

### Card 卡片

用于信息分组展示的卡片容器。

#### 子组件

- Card.Header: 卡片头部
- Card.Title: 卡片标题
- Card.Description: 卡片描述
- Card.Content: 卡片内容
- Card.Footer: 卡片底部

#### 示例

\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述信息</CardDescription>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
  <CardFooter>
    卡片底部
  </CardFooter>
</Card>
\`\`\`

### Separator 分隔线

用于分隔内容的分割线。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | 分割线方向 |
| decorative | boolean | true | 是否为装饰性 |

#### 示例

\`\`\`tsx
<Separator />
<Separator orientation="vertical" />
\`\`\`

## 数据展示

### Avatar 头像

用户头像展示组件。

#### 子组件

- Avatar.Image: 头像图片
- Avatar.Fallback: 头像占位符

#### 示例

\`\`\`tsx
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="用户头像" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
\`\`\`

### Badge 徽章

用于状态标记和计数的小型标签。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| variant | 'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' | 'default' | 徽章样式变体 |

#### 示例

\`\`\`tsx
<Badge>默认</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
\`\`\`

### Skeleton 骨架屏

用于内容加载时的占位符。

#### 示例

\`\`\`tsx
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-10 w-[200px]" />
\`\`\`

## 最佳实践

1. 表单验证
\`\`\`tsx
<form onSubmit={handleSubmit}>
  <Input
    label="用户名"
    error={errors.username}
    {...register('username')}
  />
  <Input
    type="password"
    label="密码"
    error={errors.password}
    {...register('password')}
  />
  <Button type="submit">提交</Button>
</form>
\`\`\`

2. 数据加载
\`\`\`tsx
{isLoading ? (
  <div className="space-y-3">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[150px]" />
  </div>
) : (
  <div>{content}</div>
)}
\`\`\`

3. 状态展示
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>订单状态</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center space-x-2">
      <Badge variant="success">已完成</Badge>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm text-muted-foreground">订单号：123456</span>
    </div>
  </CardContent>
</Card>
\`\`\`

## 主题定制

所有组件都支持通过 Tailwind CSS 类名进行样式定制。你可以：

1. 使用 className 属性添加自定义样式
2. 通过主题配置文件修改默认样式
3. 使用 CSS 变量覆盖默认颜色

示例：
\`\`\`tsx
// 自定义类名
<Button className="bg-custom hover:bg-custom/90">
  自定义按钮
</Button>

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        custom: '#1234567',
      },
    },
  },
}
\`\`\`

## 可访问性

所有组件都遵循 WAI-ARIA 规范，支持：

1. 键盘导航
2. 屏幕阅读器
3. ARIA 属性
4. 高对比度模式

## 注意事项

1. 所有组件都是受控组件，需要通过 props 管理状态
2. 错误处理应该在表单级别统一管理
3. 使用 TypeScript 可以获得更好的类型提示
4. 注意性能优化，避免不必要的重渲染 