---
name: admin-prototype-builder
description: Build standards-compliant Chinese admin/back-office React prototypes from product requirements and export self-contained offline HTML. Includes a portable platform-main-compatible component runtime, so use it when a user asks to 构建后台原型、生成后台 HTML、做列表页/详情页/编辑页/审核页、把 PRD 变成交互原型、按后台组件规范出页面，or wants a shareable single-file prototype without an existing platform-main checkout.
---

# Admin Prototype Builder

Turn a product manager's business description into a working React prototype that uses the standard component runtime, then export one offline HTML file.

## Output contract

- Deliver one self-contained `.html` file that opens through `file://` without npm, a server, CDN, network fonts, or remote images.
- Keep editable React source under `<runtime>/src/pages/Prototypes/<ComponentName>/`.
- Import Button, Input, Select, Table, Card, Tabs, Badge, Avatar, Label, and Separator from `@/components/ui/*`; never recreate their visual styles in a page.
- Keep prototype data visibly fictional and local. Never connect a real API unless the user explicitly asks.
- Put generated work in the user's requested folder. Otherwise use `<runtime>/prototype-output/`. Never write task output into this Skill folder.

## Runtime selection

Use one runtime consistently for prepare, create, build, and export:

1. Use `--platform <path>` when the user explicitly supplies an existing `platform-main` or a compatible project.
2. Otherwise use `--workspace <task-folder>/admin-prototype-workspace` to materialize the bundled V2 runtime.
3. If neither is passed, scripts reuse `PLATFORM_MAIN_PATH`, discover a nearby compatible project, or create `./admin-prototype-workspace` as the final fallback.

The bundled runtime contains only React/Vite/Tailwind setup, theme tokens, utilities, and the standard UI components. It intentionally excludes business pages, APIs, Garfish, `node_modules`, and build output. `prepare-runtime.mjs` installs dependencies into the task workspace on first use.

Read these references:

- Always read `references/requirements.md`, `references/design-system.md`, and `references/component-contracts.md`.
- Read `references/page-recipes.md` after identifying the page type.
- Read `references/qa-checklist.md` before delivery.

## Workflow

### 1. Normalize the requirement

Extract:

- Page name and primary user role.
- Job to be completed.
- Search/input fields.
- Display fields and information priority.
- Actions, enablement conditions, state transitions, permissions, and irreversible effects.
- Required navigation and exceptional states.

Ask only for missing information that materially changes business behavior. Ask at most three concise questions at once. Do not ask the user to choose colors, spacing, radii, table styling, or button variants; resolve those from the references.

If the user supplies enough context, proceed with explicit assumptions. See `references/requirements.md`.

### 2. Choose one page recipe

Select the closest recipe from `references/page-recipes.md`:

- `L01` standard list.
- `L02` advanced-filter list.
- `D01` standard detail.
- `D02` complex tabbed detail.
- `F01` create/edit form.
- `A01` review/approval workspace.

Do not invent a new layout until the existing recipes fail for a stated business reason.

### 3. Prepare the runtime

For the portable bundled runtime, run:

```bash
node <skill-dir>/scripts/prepare-runtime.mjs \
  --workspace <task-folder>/admin-prototype-workspace
```

For an existing compatible project, run:

```bash
node <skill-dir>/scripts/prepare-runtime.mjs \
  --platform <platform-main>
```

The agent runs installation. Do not ask the product manager to run npm.

### 4. Scaffold the React page

For a list-style page, run with the same `--workspace` or `--platform` argument selected above:

```bash
node <skill-dir>/scripts/create-prototype.mjs \
  --workspace <runtime> \
  --name <PascalCaseComponentName> \
  --slug <kebab-case-slug> \
  --title '<Chinese page title>'
```

For other recipes, scaffold first, then replace the page body while preserving:

- Real `@/components/ui/*` imports.
- `data-prototype-page` on the root page element.
- `data-state-coverage="loading empty error disabled success"` metadata.
- Local interactive state for filters, tabs, pagination, forms, drawers, dialogs, and feedback.

Do not add the prototype to production navigation unless the user requests it. The exporter imports the page directly.

### 5. Compose the business page

- Use semantic Tailwind classes backed by `src/index.css` and `tailwind.config.ts`.
- Use one default primary button per action region.
- Make every visible control work in the prototype. Do not ship dead buttons.
- Show concrete loading, empty, error, disabled, and success demonstrations through a compact “状态预览” control or an equally inspectable mechanism.
- Use `—` for absent table/detail values.
- Label all inputs visibly; give icon-only buttons an accessible name.
- Keep destructive actions distinct and require a confirmation interaction.
- Preserve desktop information density while allowing filters, actions, tabs, and tables to adapt or scroll on narrow screens.

Follow `references/component-contracts.md`; do not copy utility component implementations into the page.

### 6. Build and export one HTML file

Run the project build in the selected runtime:

```bash
npm run build
```

Then export with the same runtime argument:

```bash
node <skill-dir>/scripts/export-prototype.mjs \
  --workspace <runtime> \
  --component <absolute-or-runtime-relative-tsx-path> \
  --output <output.html> \
  --title '<page title>'
```

The exporter uses the runtime's installed React, Vite, Tailwind, aliases, and standard UI components, then inlines JavaScript and CSS. Do not hand-edit bundled HTML; fix React source and re-export.

### 7. Validate and inspect

Run:

```bash
node <skill-dir>/scripts/validate-prototype.mjs \
  <output.html> \
  --source <source.tsx>
```

Fix every failure. Then open the exported file directly in a browser and inspect at approximately 1440px desktop and 430px narrow widths. Verify interactions, table overflow, text wrapping, focus visibility, and state previews.

### 8. Deliver

Return:

- A clickable absolute link to the offline HTML.
- A clickable absolute link to the editable React source.
- A short statement of the chosen recipe and implemented interactions.
- Build, export, validation, and visual-check results.
- Explicit assumptions or unresolved business questions.

Do not ask the product manager to run npm or understand React. The agent runs the build pipeline; the product manager opens the delivered HTML.

## Non-negotiables

- Do not generate the final prototype from a blank HTML document.
- Do not duplicate standard component implementations inside a business page.
- Do not use external CDNs, remote fonts, or remote images in the exported artifact.
- Do not fake production facts, permissions, metrics, or API results. Label demonstration data as prototype data.
- Do not omit loading, empty, error, disabled, or success states.
- Do not use `window.location.reload()` for reset behavior.
- Do not put prototypes, installed dependencies, or exports in the Skill root.
- Do not modify existing business pages or production routes unless the user explicitly requests it.
