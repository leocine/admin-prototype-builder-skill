import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs, requireString, resolveRuntime } from './shared.mjs'

const args = parseArgs(process.argv.slice(2))

try {
  const platform = await resolveRuntime({ platform: args.platform, workspace: args.workspace })
  const name = requireString(args, 'name')
  const slug = requireString(args, 'slug')
  const title = requireString(args, 'title')

  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) throw new Error('--name 必须是 PascalCase React 组件名')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('--slug 必须是 kebab-case')

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const templatePath = path.resolve(scriptDir, '..', 'assets', 'page-shell.tsx')
  const targetDir = path.join(platform, 'src', 'pages', 'Prototypes', name)
  const targetPath = path.join(targetDir, `${name}.tsx`)

  try {
    await fs.access(targetPath)
    if (!args.force) throw new Error(`页面已存在：${targetPath}。如需覆盖请显式传入 --force。`)
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  const template = await fs.readFile(templatePath, 'utf8')
  const source = template
    .replaceAll('__COMPONENT_NAME__', name)
    .replaceAll('__PAGE_SLUG__', slug)
    .replaceAll('__PAGE_TITLE__', title)

  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(targetPath, source, 'utf8')
  process.stdout.write(`${targetPath}\n`)
} catch (error) {
  process.stderr.write(`[create-prototype] ${error.message}\n`)
  process.exitCode = 1
}
