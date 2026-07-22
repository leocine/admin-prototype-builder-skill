import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { hasInstalledDependencies, parseArgs, requireString, resolveRuntime } from './shared.mjs'

const args = parseArgs(process.argv.slice(2))
let tempDir

async function findAsset(directory, extension) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const candidate = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      const nested = await findAsset(candidate, extension)
      if (nested) return nested
    } else if (entry.name.endsWith(extension)) return candidate
  }
  return null
}

try {
  const platform = await fs.realpath(await resolveRuntime({ platform: args.platform, workspace: args.workspace }))
  const componentArg = requireString(args, 'component')
  const outputArg = requireString(args, 'output')
  const title = typeof args.title === 'string' && args.title.trim() ? args.title.trim() : '后台交互原型'
  const componentPath = path.isAbsolute(componentArg) ? componentArg : path.resolve(platform, componentArg)
  const outputPath = path.resolve(outputArg)

  await fs.access(componentPath)
  await fs.access(path.join(platform, 'src', 'index.css'))
  if (!hasInstalledDependencies(platform)) throw new Error(`运行时依赖尚未安装。请先运行 prepare-runtime.mjs --workspace "${platform}"`)

  const requireFromPlatform = createRequire(path.join(platform, 'package.json'))
  const viteEntry = requireFromPlatform.resolve('vite')
  const reactPluginEntry = requireFromPlatform.resolve('@vitejs/plugin-react')
  // Load sequentially: Node 24 can race when the CommonJS React plugin
  // requires Vite while Vite's ESM entry is still being imported.
  const { build } = await import(pathToFileURL(viteEntry).href)
  const { default: react } = await import(pathToFileURL(reactPluginEntry).href)

  // Keep the temporary entry under the selected runtime so Node/Vite resolves
  // the installed React and standard UI dependencies without copying them.
  tempDir = await fs.mkdtemp(path.join(platform, '.prototype-export-'))
  const outDir = path.join(tempDir, 'dist')
  const entryPath = path.join(tempDir, 'entry.tsx')
  const htmlPath = path.join(tempDir, 'index.html')
  const entrySource = `import { createRoot } from 'react-dom/client'\nimport PrototypePage from '__PROTOTYPE_COMPONENT__'\nimport '@/index.css'\n\ncreateRoot(document.getElementById('root')!).render(<PrototypePage />)\n`
  const escapedTitle = title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const htmlSource = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="prototype-source" content="platform-main-compatible React component runtime"><title>${escapedTitle}</title></head><body><div id="root"></div><script type="module" src="./entry.tsx"></script></body></html>`

  await Promise.all([
    fs.writeFile(entryPath, entrySource, 'utf8'),
    fs.writeFile(htmlPath, htmlSource, 'utf8'),
  ])

  const previousCwd = process.cwd()
  process.chdir(platform)
  try {
    await build({
      root: tempDir,
      configFile: false,
      base: './',
      logLevel: 'warn',
      plugins: [react()],
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      resolve: {
        alias: [
          { find: '__PROTOTYPE_COMPONENT__', replacement: componentPath },
          { find: '@', replacement: path.join(platform, 'src') },
        ],
      },
      css: { postcss: platform },
      build: {
        outDir,
        emptyOutDir: true,
        sourcemap: false,
        cssCodeSplit: false,
        assetsInlineLimit: 1_000_000_000,
        rollupOptions: { input: htmlPath, output: { inlineDynamicImports: true } },
      },
    })
  } finally {
    process.chdir(previousCwd)
  }

  const [cssPath, jsPath] = await Promise.all([
    findAsset(outDir, '.css'),
    findAsset(outDir, '.js'),
  ])
  if (!cssPath || !jsPath) throw new Error('构建结果缺少 CSS 或 JavaScript')

  const [css, js] = await Promise.all([fs.readFile(cssPath, 'utf8'), fs.readFile(jsPath, 'utf8')])
  const safeCss = css.replaceAll('</style', '<\\/style')
  const safeJs = js.replaceAll('</script', '<\\/script')
  const inlineHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="prototype-source" content="platform-main-compatible React component runtime"><title>${escapedTitle}</title><style>${safeCss}</style></head><body><div id="root"></div><script type="module">${safeJs}</script></body></html>`

  if (/<(?:script|link)[^>]+(?:src|href)="[^"]+\.(?:js|css)"/i.test(inlineHtml)) throw new Error('导出结果仍包含外部 JS/CSS 文件引用')

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, inlineHtml, 'utf8')
  const stat = await fs.stat(outputPath)
  process.stdout.write(`${outputPath}\n${stat.size} bytes\n`)
} catch (error) {
  process.stderr.write(`[export-prototype] ${error.stack || error.message}\n`)
  process.exitCode = 1
} finally {
  if (tempDir) await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
}
