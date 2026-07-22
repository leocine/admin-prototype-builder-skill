import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { hasInstalledDependencies, parseArgs, resolveRuntime } from './shared.mjs'

const args = parseArgs(process.argv.slice(2))

try {
  const runtime = await resolveRuntime({ platform: args.platform, workspace: args.workspace })
  const shouldInstall = !args['skip-install'] && (!hasInstalledDependencies(runtime) || args.install)

  if (shouldInstall) {
    const result = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--cache', path.join(runtime, '.npm-cache')], {
      cwd: runtime,
      stdio: 'inherit',
      shell: false,
    })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error(`npm install 失败，退出码 ${result.status}`)
  }

  process.stdout.write(`${path.resolve(runtime)}\n${shouldInstall ? '运行时已准备并安装依赖' : '运行时已准备'}\n`)
} catch (error) {
  process.stderr.write(`[prepare-runtime] ${error.stack || error.message}\n`)
  process.exitCode = 1
}
