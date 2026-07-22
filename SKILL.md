---
name: admin-prototype-builder
description: 根据产品需求构建符合规范的中文后台 React 交互原型，并导出可独立打开的离线单文件 HTML。内置可独立分发、兼容 platform-main 的组件运行时。用户要求构建后台原型、生成后台 HTML、制作列表页/详情页/编辑页/审核页、将 PRD 转成交互原型、按照后台组件规范出页面，或需要在没有 platform-main 项目的情况下交付可分享原型时使用。
---

# 后台原型构建器

将产品经理的业务描述转换为使用标准组件运行时的 React 交互原型，并导出一个离线 HTML 文件。

## 输出要求

- 必须交付一个可通过 `file://` 直接打开的独立 `.html` 文件，不得依赖 npm、服务器、CDN、网络字体或远程图片。
- 必须将可编辑的 React 源码保存在 `<runtime>/src/pages/Prototypes/<ComponentName>/`。
- 必须从 `@/components/ui/*` 导入 Button、Input、Select、Table、Card、Tabs、Badge、Avatar、Label 和 Separator，不得在业务页面中重新实现这些组件的视觉样式。
- 原型数据必须明显是本地虚构数据。除非用户明确要求，否则不得连接真实 API。
- 将生成结果放到用户指定的目录；用户未指定时，使用 `<runtime>/prototype-output/`。不得把任务输出写入本 Skill 目录。

## 运行时选择

准备、创建、构建和导出全过程必须使用同一个运行时：

1. 用户明确提供现有 `platform-main` 或兼容项目时，使用 `--platform <path>`。
2. 其他情况使用 `--workspace <task-folder>/admin-prototype-workspace`，将内置 V2 运行时释放到任务目录。
3. 两者都未传入时，脚本依次尝试复用 `PLATFORM_MAIN_PATH`、查找附近的兼容项目，最后创建 `./admin-prototype-workspace`。

内置运行时只包含 React、Vite、Tailwind 配置、主题变量、工具函数和标准 UI 组件，不包含业务页面、API、Garfish、`node_modules` 或构建产物。`prepare-runtime.mjs` 会在首次使用时把依赖安装到任务工作区。

按以下规则读取参考文件：

- 每次都读取 `references/requirements.md`、`references/design-system.md` 和 `references/component-contracts.md`。
- 确认页面类型后读取 `references/page-recipes.md`。
- 交付前读取 `references/qa-checklist.md`。

## 工作流程

### 1. 整理需求

提取以下信息：

- 页面名称和主要用户角色。
- 用户需要完成的核心任务。
- 搜索项和输入字段。
- 展示字段及信息优先级。
- 操作、启用条件、状态流转、权限和不可逆影响。
- 必要的页面跳转和异常状态。

只有缺失信息会实质改变业务行为时才追问，每次最多提出三个简短问题。不得要求用户选择颜色、间距、圆角、表格样式或按钮变体，这些内容必须从参考规范中确定。

上下文足够时直接继续，并明确说明采用的合理假设。具体规则见 `references/requirements.md`。

### 2. 选择页面模板

从 `references/page-recipes.md` 中选择最接近的一种模板：

- `L01` 标准列表页。
- `L02` 高级筛选列表页。
- `D01` 标准详情页。
- `D02` 多标签详情页。
- `F01` 新建/编辑表单。
- `A01` 审核工作台。

除非能够说明现有模板不适合的业务原因，否则不得自行发明新的页面结构。

### 3. 准备运行时

使用内置运行时时执行：

```bash
node <skill-dir>/scripts/prepare-runtime.mjs \
  --workspace <task-folder>/admin-prototype-workspace
```

使用现有兼容项目时执行：

```bash
node <skill-dir>/scripts/prepare-runtime.mjs \
  --platform <platform-main>
```

由 AI 执行依赖安装，不得要求产品经理运行 npm。

### 4. 创建 React 页面骨架

列表类页面使用前面选定的同一个 `--workspace` 或 `--platform` 参数执行：

```bash
node <skill-dir>/scripts/create-prototype.mjs \
  --workspace <runtime> \
  --name <PascalCaseComponentName> \
  --slug <kebab-case-slug> \
  --title '<中文页面标题>'
```

其他页面先生成骨架，再替换页面主体，同时必须保留：

- 真实的 `@/components/ui/*` 组件导入。
- 根页面元素上的 `data-prototype-page`。
- `data-state-coverage="loading empty error disabled success"` 元数据。
- 筛选、标签页、分页、表单、抽屉、弹窗和反馈所需的本地交互状态。

除非用户明确要求，否则不得把原型加入生产导航；导出工具会直接导入原型页面。

### 5. 组合业务页面

- 使用由 `src/index.css` 和 `tailwind.config.ts` 支持的语义化 Tailwind 类名。
- 每个操作区域最多设置一个默认主按钮。
- 所有可见控件都必须可操作，不得交付无响应按钮。
- 通过紧凑的“状态预览”控件或同等可检查方式，具体展示加载、空数据、失败、禁用和成功状态。
- 表格和详情中的缺失值统一使用“—”。
- 所有输入控件必须有可见标签；仅图标按钮必须有无障碍名称。
- 危险操作必须与普通操作区分，并在执行前提供确认交互。
- 保持桌面端信息密度，同时让筛选、操作、标签页和表格在窄屏下能够换行或滚动。

必须遵循 `references/component-contracts.md`，不得把基础组件实现复制到业务页面。

### 6. 构建并导出单文件 HTML

在选定的运行时中执行构建：

```bash
npm run build
```

然后使用相同的运行时参数导出：

```bash
node <skill-dir>/scripts/export-prototype.mjs \
  --workspace <runtime> \
  --component <绝对路径或相对运行时的tsx路径> \
  --output <output.html> \
  --title '<页面标题>'
```

导出工具使用运行时中已安装的 React、Vite、Tailwind、路径别名和标准 UI 组件，并将 JavaScript 与 CSS 内联。不得直接修改导出的 HTML；必须修改 React 源码后重新导出。

### 7. 校验与检查

执行：

```bash
node <skill-dir>/scripts/validate-prototype.mjs \
  <output.html> \
  --source <source.tsx>
```

修复全部失败项。随后在浏览器中直接打开导出的文件，分别以约 1440px 桌面宽度和 430px 窄屏宽度检查。确认交互、表格溢出、文字换行、焦点可见性和状态预览均正常。

### 8. 交付

必须返回：

- 离线 HTML 的可点击绝对路径。
- 可编辑 React 源码的可点击绝对路径。
- 所选页面模板和已实现交互的简短说明。
- 构建、导出、自动校验和视觉检查结果。
- 明确列出采用的假设或仍未解决的业务问题。

不得要求产品经理运行 npm 或理解 React。由 AI 完成构建流程，产品经理只需打开交付的 HTML。

## 强制规则

- 不得从空白 HTML 文档直接制作最终原型。
- 不得在业务页面中重复实现标准组件。
- 导出文件不得使用外部 CDN、远程字体或远程图片。
- 不得虚构生产事实、权限、指标或 API 结果；演示数据必须标注为原型数据。
- 不得遗漏加载、空数据、失败、禁用或成功状态。
- 重置行为不得使用 `window.location.reload()`。
- 不得把原型、已安装依赖或导出文件放入 Skill 根目录。
- 除非用户明确要求，否则不得修改现有业务页面或生产路由。
