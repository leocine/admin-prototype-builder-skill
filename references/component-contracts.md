# 组件使用规范

使用选定标准运行时（内置 V2 或兼容的 `platform-main`）提供的真实组件。只能组合组件，不得在原型页面中重新实现组件。

## 导入方式

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
```

## Button

可用变体：`default`、`secondary`、`outline`、`ghost`、`link`、`destructive`。

可用尺寸：`sm`、`default`、`lg`、`icon`。

使用规则：

- 每个操作区域只使用一个 `default`。
- 独立的次要操作使用 `outline`。
- 返回、复制和轻量行操作使用 `ghost`。
- 只有会损害、删除或禁用数据及访问权限的操作才使用 `destructive`。
- 仅图标按钮必须同时设置 `title` 和 `aria-label`。
- 执行危险状态变更前必须提供确认交互。

## Input、Label、Select

- 每个控件上方必须放置可见的 Label。
- placeholder 只用于格式或示例，不得代替 Label。
- 可枚举值使用 Select。
- 提供明确的“全部”选项，并将其映射为不筛选。
- 受控值必须保存在 React state 中。
- 直接重置 state，不得刷新页面。

## Card

- Card 用于筛选区、数据容器、摘要和明确的详情分组。
- 不得把每个文字区块都放入 Card。
- 避免嵌套视觉权重相同的 Card。
- CardHeader 和 CardTitle 只用于真实模块标题，不得重复页面标题。

## Table

- 第一列放置主要业务身份信息。
- 最后一列放置操作。
- 缺失值使用“—”。
- 每行可见操作控制在 1–3 个。
- 状态使用 Badge。
- 保留组件内部横向滚动；必要时设置有意义的 `min-w-*` 表格宽度。
- 加载行和空数据行必须设置正确的 `colSpan`。

## Badge

- `default`：语义颜色扩展前的正常或正向状态。
- `secondary`：身份、已完成或低强调类别。
- `outline`：中性、待处理或元数据。
- `destructive`：冻结、驳回、无效或危险状态。
- 必须包含状态文字，不得只通过颜色传达状态。

## Tabs

- 用于同一业务对象下的同级内容区。
- 建议可见数量不超过 7 个。
- 超过数量时必须先分组或重构，再考虑横向滚动。
- 切换会影响其他状态时，Tabs 必须使用受控模式。

## Avatar 与 Separator

- AvatarFallback 必须使用真实可见名称中的字符。
- AvatarImage 必须提供有意义的 alt。
- 只有内容关系需要分隔线、但不需要另一个 Card 时才使用 Separator。

## 尚未标准化的组件

当前组件库尚未标准化 Dialog、Drawer、Toast、Checkbox、Radio、Switch、DatePicker、Textarea、Upload、Breadcrumb、Skeleton 和 Pagination。

原型需要这些组件时：

1. 使用语义化 HTML 和现有主题变量，在当前页面范围内构建满足无障碍要求的组合。
2. 组件只能保留在原型页面中；未经明确授权，不得加入全局 `components/ui`。
3. 在交付说明中标记为“待规范沉淀”。
4. 不得把它描述成已经存在的平台标准组件。
