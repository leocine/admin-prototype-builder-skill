import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundledRuntime = path.join(skillDir, 'assets', 'platform-runtime')

export function parseArgs(argv) {
  const result = { _: [] }
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (!item.startsWith('--')) {
      result._.push(item)
      continue
    }
    const key = item.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) result[key] = true
    else {
      result[key] = next
      index += 1
    }
  }
  return result
}

function isPlatformRoot(candidate) {
  if (!candidate) return false
  return fs.existsSync(path.join(candidate, 'package.json')) && fs.existsSync(path.join(candidate, 'src', 'components', 'ui'))
}

function isManagedRuntime(candidate) {
  if (fs.existsSync(path.join(candidate, '.admin-prototype-runtime'))) return true
  try {
    return JSON.parse(fs.readFileSync(path.join(candidate, 'package.json'), 'utf8')).name === 'admin-prototype-runtime'
  } catch {
    return false
  }
}

function findExternalPlatform(explicitPath) {
  const candidates = []
  if (explicitPath) {
    const absolute = path.resolve(explicitPath)
    if (!isPlatformRoot(absolute)) throw new Error(`--platform 不是有效的 React 组件项目：${absolute}`)
    return absolute
  }
  if (process.env.PLATFORM_MAIN_PATH) candidates.push(process.env.PLATFORM_MAIN_PATH)

  let cursor = process.cwd()
  for (let depth = 0; depth < 6; depth += 1) {
    candidates.push(cursor)
    candidates.push(path.join(cursor, 'platform-main'))
    const parent = path.dirname(cursor)
    if (parent === cursor) break
    cursor = parent
  }

  for (const candidate of candidates) {
    const absolute = path.resolve(candidate)
    if (isPlatformRoot(absolute)) return absolute
  }

  return null
}

export async function resolveRuntime({ platform, workspace } = {}) {
  if (workspace) {
    const target = path.resolve(workspace)
    await materializeBundledRuntime(target)
    return target
  }

  const external = findExternalPlatform(platform)
  if (external) return external

  const target = path.resolve(process.env.ADMIN_PROTOTYPE_WORKSPACE || path.join(process.cwd(), 'admin-prototype-workspace'))
  await materializeBundledRuntime(target)
  return target
}

export async function materializeBundledRuntime(target) {
  if (!isPlatformRoot(bundledRuntime)) throw new Error(`Skill 内置运行时不完整：${bundledRuntime}`)
  if (isPlatformRoot(target) && !isManagedRuntime(target)) {
    throw new Error(`--workspace 指向了一个非 Skill 管理的项目：${target}。请对现有项目使用 --platform。`)
  }
  await fsp.mkdir(target, { recursive: true })
  await fsp.cp(bundledRuntime, target, { recursive: true, force: true })
  return target
}

export function hasInstalledDependencies(runtime) {
  return fs.existsSync(path.join(runtime, 'node_modules', 'react', 'package.json'))
}

export function requireString(args, name) {
  const value = args[name]
  if (typeof value !== 'string' || !value.trim()) throw new Error(`缺少 --${name}`)
  return value.trim()
}

export function toPosix(value) {
  return value.split(path.sep).join('/')
}
