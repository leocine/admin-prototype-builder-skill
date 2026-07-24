import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from './shared.mjs'

const args = parseArgs(process.argv.slice(2))
const htmlArg = args._[0]
const failures = []
const warnings = []

function check(condition, message) {
  if (!condition) failures.push(message)
}

try {
  if (!htmlArg) throw new Error('用法：node validate-prototype.mjs <output.html> [--source <source.tsx>]')
  const htmlPath = path.resolve(htmlArg)
  const html = await fs.readFile(htmlPath, 'utf8')

  check(/<!doctype html>/i.test(html), '缺少 HTML doctype')
  check(/<meta[^>]+name="viewport"/i.test(html), '缺少 viewport')
  check(/<meta[^>]+name="prototype-source"[^>]+platform-main-compatible React component runtime/i.test(html), '缺少标准 React 组件运行时来源标记')
  check(/<style>[\s\S]+<\/style>/i.test(html), '没有内联 CSS')
  check(/<script type="module">[\s\S]+<\/script>/i.test(html), '没有内联 JavaScript')
  check(!/(?:src|href)=["'](?:https?:)?\/\//i.test(html), '存在外部 src/href 依赖')
  check(!/@import\s+(?:url\()?['"]?(?:https?:)?\/\//i.test(html), 'CSS 存在外部 @import')
  check(!/url\(["']?(?:https?:)?\/\//i.test(html), 'CSS 存在远程资源')
  check(!/(?:src|href)=["'][^"']+\.(?:js|css)["']/i.test(html), '仍引用外部 JS/CSS 文件')
  check(html.includes('data-prototype-page'), '缺少 data-prototype-page 元数据')
  check(html.includes('data-state-coverage'), '缺少页面状态覆盖元数据')
  for (const state of ['loading', 'empty', 'error', 'disabled', 'success']) check(html.includes(state), `缺少 ${state} 状态覆盖`)
  check(Buffer.byteLength(html) > 50_000, '导出文件异常小，可能未包含 React/CSS bundle')

  if (typeof args.source === 'string') {
    const sourcePath = path.resolve(args.source)
    const source = await fs.readFile(sourcePath, 'utf8')
    check(/@\/components\/ui\//.test(source), 'React 源码没有使用标准 UI 组件')
    check(/data-prototype-page=/.test(source), 'React 源码缺少 data-prototype-page')
    check(/data-state-coverage=/.test(source), 'React 源码缺少 data-state-coverage')
    if (/<Table(?:\s|>)/.test(source)) {
      check(/data-list-density=["']compact["']/.test(source), '列表页面缺少 data-list-density="compact"')
    }
    if (/上一页|下一页/.test(source)) {
      check(/首页/.test(source) && /尾页/.test(source), '分页缺少首页或尾页操作')
      check(/aria-label=["']跳转页码["']/.test(source), '分页缺少可访问的跳页输入')
    }
    check(!/>\s*原型数据\s*</.test(source), '默认业务界面不得显示“原型数据”标记')
    check(!/aria-label=["']切换页面状态["']/.test(source), '默认业务界面不得显示状态预览切换器')
    check(!/window\.location\.reload\s*\(/.test(source), '重置逻辑不应刷新页面')
    if (/#[0-9a-f]{3,8}\b/i.test(source)) failures.push('业务页面包含直接十六进制颜色')
    if (/\b(?:bg|text|border)-(?:red|blue|green|yellow|orange|purple|pink|slate|gray)-\d{2,3}\b/.test(source)) failures.push('业务页面使用了固定 Tailwind 色阶')
    if (!/aria-label=|title=/.test(source)) warnings.push('未检测到 aria-label/title；如有图标按钮请补充')
  }

  if (failures.length) {
    process.stderr.write(`FAIL ${htmlPath}\n${failures.map((item) => `- ${item}`).join('\n')}\n`)
    if (warnings.length) process.stderr.write(`${warnings.map((item) => `WARN ${item}`).join('\n')}\n`)
    process.exitCode = 1
  } else {
    process.stdout.write(`PASS ${htmlPath}\n`)
    if (warnings.length) process.stdout.write(`${warnings.map((item) => `WARN ${item}`).join('\n')}\n`)
  }
} catch (error) {
  process.stderr.write(`[validate-prototype] ${error.message}\n`)
  process.exitCode = 1
}
