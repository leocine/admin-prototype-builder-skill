# 智能体维护与修改规则

本文件约束进入本仓库进行开发、维护、检查和发布的智能体，适用于整个仓库。

本文件不重复产品经理调用 Skill 后的原型构建流程。构建原型时遵循 `SKILL.md`；维护本 Skill 时遵循本文件。

## 维护目标

将 admin-prototype-builder 维护为可独立分发的 Codex Skill，并确保以下内容始终一致：

- `SKILL.md` 中的执行流程。
- `references/` 中的产品、设计和组件规范。
- `assets/platform-runtime/` 中可运行的 React 组件实现。
- `scripts/` 中的准备、创建、导出和校验工具。
- README、版本记录和实际发布包。

不得出现“文档已经规定，但组件或脚本没有实现”以及“代码已经改变，但规范仍描述旧行为”的情况。

## 开始工作前

1. 先确认用户要求属于执行原型任务，还是修改 Skill 本身。
2. 修改 Skill 时先读取 `SKILL.md`，再读取与任务直接相关的参考文件和实现文件。
3. 检查 Git 状态和现有修改，不得覆盖或夹带与当前任务无关的用户改动。
4. 明确本次修改会影响哪些规范、组件、脚本、文档和版本文件，再开始编辑。

按修改类型读取：

- 需求理解或追问规则：`references/requirements.md`。
- 配色、字体、间距、布局或响应式：`references/design-system.md`、`assets/platform-runtime/src/index.css` 和 `assets/platform-runtime/tailwind.config.ts`。
- 组件能力或使用方式：`references/component-contracts.md` 和 `assets/platform-runtime/src/components/ui/`。
- 页面结构：`references/page-recipes.md` 和 `assets/page-shell.tsx`。
- 导出与交付质量：`references/qa-checklist.md`、`scripts/export-prototype.mjs` 和 `scripts/validate-prototype.mjs`。
- Skill 触发条件或主流程：`SKILL.md` 和 `agents/openai.yaml`。
- 安装、目录或发布方式：README、`CHANGELOG.md` 和 `.github/`。

## 文件职责

- `SKILL.md`：只保留 AI 执行原型任务必须遵守的主流程和强制规则。
- `references/`：保存详细规范；同一规则不得同时在多个文件中重复维护。
- `assets/platform-runtime/`：保存可复制运行的最小 React 运行时和标准组件，不存放业务页面。
- `scripts/`：保存可重复、可校验的自动化操作，不把确定性流程改写成长篇提示词。
- `agents/openai.yaml`：保存界面名称、简介和默认调用提示，必须与 `SKILL.md` 能力一致。
- README：面向使用者说明安装、调用、输出和目录结构，不承载详细设计规则。
- `CHANGELOG.md`：按版本倒序记录公开更新内容。
- `.github/`：只保存仓库校验和自动发布能力。

## 修改与同步规则

- 修改视觉变量时，必须同步检查设计规范、运行时主题变量、Tailwind 配置和受影响组件。
- 修改组件 API、变体或行为时，必须同步修改组件实现、组件使用规范和相关页面种子。
- 修改 Skill 主流程或命令参数时，必须同步检查对应脚本、README 和默认提示语。
- 新增页面模板时，必须说明适用条件、结构和强制规则，并验证标准组件能够实现。
- 新增全局组件前必须获得明确授权；原型中的临时组合不得冒充平台标准组件。
- 删除或重命名文件前，必须检查 `SKILL.md`、README、脚本和其他参考文件中的引用。
- 保持 `SKILL.md` 简洁；详细内容放入一层 `references/`，避免深层引用和重复规则。
- 只在用户明确要求时修改现有业务页面、生产路由或外部 `platform-main`。

## 安全与内容边界

- 不得提交生成的原型、`node_modules`、`dist`、截图、本地缓存或系统元数据。
- 不得写入真实 API 地址、Token、密码、私钥、客户数据、真实业务数据或生产配置。
- 示例数据必须明显虚构，不得使用可识别的真实个人或企业信息。
- 发布包不得包含依赖目录、构建产物、原型输出、凭据或本地文件。

## 验证要求

根据修改范围执行足够的验证：

- 修改 Markdown 或 Skill 元数据：运行 Skill 快速校验和发布校验。
- 修改 `SKILL.md`、需求规则、页面模板或组件规范：增加一次独立需求理解测试，确认 AI 能正确选择流程并保持规则强度。
- 修改脚本：检查语法，并实际运行受影响命令的代表性路径。
- 修改运行时、主题或组件：执行构建，生成至少一个代表性原型并完成桌面与窄屏检查。
- 修改导出逻辑：验证离线 HTML 可通过 `file://` 打开且不包含外部依赖。
- 修改发布流程：验证工作流配置、版本提取和干净 ZIP 内容。

不得因修改“看起来只是文档”而跳过版本一致性和引用检查。

## 版本规则

所有准备合并到 `main` 的修改都必须更新 `assets/platform-runtime/package.json`：

- Patch：文档、问题修复、校验或兼容性维护。
- Minor：向后兼容的能力、组件、页面模板或工作流程新增。
- Major：不兼容的行为、结构或安装方式调整。

README 中的当前稳定版本必须等于 package 版本号加前缀 `v`。不得重复使用或移动已有版本 Tag。
每个版本都必须添加到 `CHANGELOG.md` 顶部，最新版本必须与 package 版本一致，更新内容统一使用中文。
公开 Release 正文只提取当前版本的更新内容，不得加入“使用影响”或“验证结果”。

## 合并与发布

1. 在 `codex/*` 分支上工作。
2. 合并前运行 `node .github/scripts/validate-release.mjs --base <main SHA>`。
3. 在 PR 中说明修改内容、使用影响和验证结果。
4. 通过 PR 合并，不得把普通更新直接推送到 `main`。
5. 合并后由 `.github/workflows/release.yml` 自动创建 Tag、干净 ZIP 和 GitHub Release。Release 标题只能显示版本号，例如 `v2.0.8`。
6. 确认自动流程成功，并确认授权协作者能够下载新 Release。
7. 自动发布失败时，修复工作流或仓库状态，不得手工创建内容不一致的 Release。

GitHub Release 尚未创建成功时，本次正式更新不得视为完成。
