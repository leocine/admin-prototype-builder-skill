import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const packagePath = path.join(root, 'assets', 'platform-runtime', 'package.json')
const failures = []

function fail(message) {
  failures.push(message)
}

function parseVersion(value, label) {
  if (!/^\d+\.\d+\.\d+$/.test(value)) {
    fail(label + ' 不是有效的 x.y.z 版本：' + value)
    return [0, 0, 0]
  }
  return value.split('.').map(Number)
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index]
  }
  return 0
}

const requiredPaths = [
  'SKILL.md',
  'README.md',
  'AGENTS.md',
  'CHANGELOG.md',
  'agents/openai.yaml',
  'assets/page-shell.tsx',
  'assets/platform-runtime/src/components/ui',
  'references/requirements.md',
  'references/design-system.md',
  'references/component-contracts.md',
  'references/page-recipes.md',
  'references/qa-checklist.md',
  'scripts/prepare-runtime.mjs',
  'scripts/create-prototype.mjs',
  'scripts/export-prototype.mjs',
  'scripts/validate-prototype.mjs',
]

for (const relative of requiredPaths) {
  if (!fs.existsSync(path.join(root, relative))) fail('缺少必要文件或目录：' + relative)
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const currentParts = parseVersion(packageJson.version, '当前版本')
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8')
if (!readme.includes('当前稳定版本：' + String.fromCharCode(96) + 'v' + packageJson.version + String.fromCharCode(96))) {
  fail('README 当前稳定版本必须是 v' + packageJson.version)
}
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8')
if (!changelog.startsWith('# Changelog\n')) fail('CHANGELOG.md 必须以 # Changelog 开头')

const versionHeading = '## v' + packageJson.version
const versionHeadings = [...changelog.matchAll(/^## v\d+\.\d+\.\d+$/gm)]
if (!versionHeadings.length || versionHeadings[0][0] !== versionHeading) {
  fail('CHANGELOG.md 的最新版本必须是 v' + packageJson.version)
}

const sectionStart = changelog.indexOf(versionHeading)
const nextSection = sectionStart >= 0 ? changelog.indexOf('\n## v', sectionStart + versionHeading.length) : -1
const currentEntry = sectionStart >= 0
  ? changelog.slice(sectionStart, nextSection >= 0 ? nextSection : undefined).trim()
  : ''
if (!/[\u3400-\u9fff]/.test(currentEntry)) fail('CHANGELOG.md 当前版本内容必须使用中文')
if (/使用影响|验证结果|What's Changed|Full Changelog|Release validation passed|Tag and ZIP were generated|The ZIP excludes/.test(currentEntry)) {
  fail('CHANGELOG.md 当前版本只应包含中文更新内容')
}

const notesOutputIndex = process.argv.indexOf('--notes-output')
const notesOutput = notesOutputIndex >= 0 ? process.argv[notesOutputIndex + 1] : ''
if (notesOutputIndex >= 0 && !notesOutput) fail('使用 --notes-output 时必须提供输出路径')

const baseIndex = process.argv.indexOf('--base')
if (baseIndex >= 0) {
  const base = process.argv[baseIndex + 1]
  if (!base) fail('使用 --base 时必须提供 Git SHA')
  else {
    try {
      const basePackage = JSON.parse(execFileSync(
        'git',
        ['show', base + ':assets/platform-runtime/package.json'],
        { cwd: root, encoding: 'utf8' },
      ))
      const baseParts = parseVersion(basePackage.version, 'main 基准版本')
      if (compareVersions(currentParts, baseParts) <= 0) {
        fail('版本必须高于 main：当前 ' + packageJson.version + '，main ' + basePackage.version)
      }
    } catch (error) {
      fail('无法读取 main 基准版本：' + error.message)
    }
  }
}

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const forbiddenPath = /(^|\/)(node_modules|dist|prototype-output|admin-prototype-workspace|\.npm-cache)(\/|$)|(^|\/)\.DS_Store$|(^|\/)\.env(?:\.|$)|\.(?:pem|p12|key|mobileprovision)$/
const secretPatterns = [
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/,
]

for (const relative of tracked) {
  if (forbiddenPath.test(relative)) fail('仓库包含禁止文件：' + relative)
  const absolute = path.join(root, relative)
  if (!fs.existsSync(absolute)) continue
  if (!fs.statSync(absolute).isFile()) continue
  const content = fs.readFileSync(absolute)
  if (content.includes(0)) continue
  const text = content.toString('utf8')
  if (secretPatterns.some((pattern) => pattern.test(text))) fail('疑似凭据：' + relative)
}

for (const relative of tracked.filter((item) => item.startsWith('scripts/') && item.endsWith('.mjs'))) {
  try {
    execFileSync(process.execPath, ['--check', path.join(root, relative)], { stdio: 'pipe' })
  } catch (error) {
    fail('脚本语法检查失败：' + relative + '\n' + (error.stderr?.toString() || error.message))
  }
}

if (failures.length) {
  process.stderr.write('Release validation failed:\n' + failures.map((item) => '- ' + item).join('\n') + '\n')
  process.exit(1)
}

if (notesOutput) fs.writeFileSync(path.resolve(root, notesOutput), currentEntry + '\n')

process.stdout.write('Release validation passed for v' + packageJson.version + ' (' + tracked.length + ' tracked files)\n')
