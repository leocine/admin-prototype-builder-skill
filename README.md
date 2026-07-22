# 后台原型构建 Skill

这是一个给 Codex 和产品经理使用的后台原型构建 Skill，用于把中文后台产品需求转换为符合统一组件、配色和页面结构规范的 React 交互原型，并导出可直接分享的离线单文件 HTML。

V2 内置最小 React、Vite、Tailwind 运行时和标准后台组件。使用者不需要单独下载完整 `platform-main`，也不需要理解 React；产品经理只需要说明业务目标、字段、操作和状态，Codex 会负责搭建、构建、检查与导出。

## 使用前准备

- 已安装 Codex。
- 首次生成原型时允许安装公开 npm 依赖。
- 如果要使用公司最新的外部 `platform-main`，需要提供其本地路径；不提供时自动使用 Skill 内置运行时。
- 私有仓库使用者需要先获得本仓库访问权限，并在本机完成 GitHub 登录。

不要把真实接口 Token、账号密码、客户数据、内部 API 地址或生产环境配置提交到此仓库。

## 安装 Skill

本 Skill 位于私有仓库根目录，推荐通过 Git 克隆安装，以便后续完整同步 `assets/`、`references/` 和 `scripts/`。

新开一个 Codex 任务，把下面这段话直接发给 Codex：

```text
请确认 GitHub 已登录，然后把私有仓库 leocine/admin-prototype-builder-skill 克隆到 ~/.codex/skills/admin-prototype-builder。如果目录已存在，先确认它是该仓库再使用 git pull --ff-only 更新。完成后验证 SKILL.md、assets、references 和 scripts 都存在，并提醒我新开一个 Codex 任务。
```

手动首次安装：

```bash
git clone https://github.com/leocine/admin-prototype-builder-skill.git ~/.codex/skills/admin-prototype-builder
```

后续同步更新：

```bash
git -C ~/.codex/skills/admin-prototype-builder pull --ff-only
```

安装或更新完成后，开启一个新的 Codex 任务。`main` 与最新 GitHub Release 应始终保持一致。

## 使用 Skill

在新的 Codex 任务中直接描述后台需求，例如：

```text
用 $admin-prototype-builder 帮我做一个退款审核后台原型。
需要订单筛选、退款信息、审核通过和驳回操作，并输出可分享的 HTML。
```

产品经理重点说明：

- 页面要解决什么业务问题。
- 谁使用这个页面。
- 需要哪些筛选项、字段和操作。
- 操作的条件、权限和状态变化。
- 是否需要列表、详情、表单、弹窗、审核或异常状态。

颜色、间距、圆角、按钮样式、表格密度和响应式布局由 Skill 按规范处理，不需要逐项描述。

## 输出结果

每次构建默认交付：

- 一份可直接双击打开、通过 `file://` 运行的离线 HTML。
- 一份可继续修改的 React 页面源码。
- 已实现的筛选、分页、表单、弹窗、状态切换和反馈交互。
- 加载、空数据、失败、禁用和成功状态。
- 构建、导出、自动校验及桌面端和窄屏检查结果。

最终 HTML 不依赖服务器、CDN、远程字体或远程图片。

## 目录结构

```text
admin-prototype-builder-skill/
├── SKILL.md                         # Skill 入口：需求分析、构建、导出和交付规则
├── README.md                        # 本文件：安装、使用、维护和版本发布说明
├── CHANGELOG.md                     # 按版本倒序维护的中文更新记录
├── AGENTS.md                        # 智能体维护、修改、验证与发布规则
├── .github/
│   ├── scripts/validate-release.mjs # 版本、完整性和安全校验
│   └── workflows/release.yml        # main 更新后自动发布 Release
├── agents/
│   └── openai.yaml                  # Codex 中展示的名称、简介和默认提示
├── assets/
│   ├── page-shell.tsx               # 标准列表页原型种子
│   └── platform-runtime/            # 可独立分发的最小 React 组件运行时
│       ├── src/components/ui/       # Button、Input、Select、Table 等标准组件
│       ├── src/index.css            # 主题变量和基础样式
│       ├── package.json             # 精确锁定的 React/Vite/Tailwind 依赖
│       └── vite/tailwind/tsconfig   # 构建配置
├── references/
│   ├── requirements.md              # 产品需求提取和合理假设
│   ├── design-system.md             # 配色、排版、间距和页面视觉规范
│   ├── component-contracts.md       # 组件使用约束
│   ├── page-recipes.md              # 列表、详情、表单和审核页面模板
│   └── qa-checklist.md              # 原型交付检查清单
└── scripts/
    ├── prepare-runtime.mjs           # 准备运行时并安装首次依赖
    ├── create-prototype.mjs          # 创建 React 原型页面
    ├── export-prototype.mjs          # 导出离线单文件 HTML
    └── validate-prototype.mjs        # 检查导出物和源码
```

## 构建流程

Codex 会按照下面的顺序完成工作：

1. **理解需求**：提取页面角色、目标、字段、操作、权限、状态和异常场景。
2. **选择页面模板**：从标准列表、复杂筛选列表、详情、标签详情、表单和审核工作台中选择最接近的结构。
3. **准备运行时**：优先复用明确指定的兼容项目，否则在任务目录创建内置最小运行时。
4. **组合标准组件**：使用真实 React 组件构建页面，不在业务页面重复实现按钮、表格或筛选器样式。
5. **补齐交互状态**：确保可见控件可操作，并覆盖加载、空数据、失败、禁用和成功状态。
6. **构建与导出**：运行 React 构建并把 JavaScript、CSS 全部内联为一个 HTML 文件。
7. **自动检查**：验证没有外部依赖、固定颜色、死按钮和缺失状态。
8. **视觉验收**：检查桌面和窄屏布局后交付 HTML 与 React 源码。

## 版本与更新

当前稳定版本：`v2.0.7`。

所有版本的更新记录统一维护在 [CHANGELOG.md](CHANGELOG.md)，正式安装包通过 [GitHub Releases](https://github.com/leocine/admin-prototype-builder-skill/releases) 发布。合并到 `main` 后会自动提取当前版本记录并生成 Tag、Release 和干净 ZIP；维护细则见 `AGENTS.md`。
