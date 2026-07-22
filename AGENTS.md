# 仓库维护规则

本文件中的规则适用于整个仓库。

## 维护目标

将 admin-prototype-builder 维护为可独立分发的 Codex Skill。必须保留内置 React 运行时、标准组件、参考规范、导出脚本和离线 HTML 交付能力。

## 修改规则

- 不得向仓库提交生成的原型、`node_modules`、`dist`、截图、凭据、真实业务数据或本地缓存。
- 不得添加真实 API 地址、Token、密码、私钥、客户数据或生产环境配置。
- 保持 `SKILL.md` 简洁，将详细领域规范放入 `references/`。
- 修改脚本后必须检查脚本语法，发布前必须运行 Skill 快速校验。
- 安装方式、使用方式、输出结果或目录结构发生变化时，必须同步更新 README。

## 版本规则

所有准备合并到 `main` 的修改都必须更新 `assets/platform-runtime/package.json` 版本号：

- Patch：文档、问题修复、校验或兼容性维护。
- Minor：向后兼容的能力、组件、页面模板或工作流程新增。
- Major：不兼容的行为、结构或安装方式调整。

README 中的当前稳定版本必须等于 package 版本号加前缀 `v`。不得重复使用或移动已有版本 Tag。
每个版本都必须添加到 `CHANGELOG.md` 顶部，其最新版本必须与 package 版本一致，更新内容统一使用中文。
自动发布会提取 `CHANGELOG.md` 的最新版本段落。公开 Release 正文只写更新内容，不得加入“使用影响”或“验证结果”。

## 合并与发布

1. 在 `codex/*` 分支上工作。
2. 合并前运行 `node .github/scripts/validate-release.mjs --base <main SHA>`。
3. 在 PR 中说明修改内容、使用影响和验证结果。
4. 必须通过 PR 合并，不得把普通更新直接推送到 `main`。
5. 合并后由 `.github/workflows/release.yml` 自动创建 Tag、干净 ZIP 和 GitHub Release。Release 标题只能显示版本号，例如 `v2.0.6`。
6. 必须确认自动流程执行成功，并确认授权协作者能够下载新 Release。
7. 自动发布失败时，必须修复工作流或仓库状态，不得手工创建内容不一致的 Release。

GitHub Release 尚未创建成功时，本次正式更新不得视为完成。
