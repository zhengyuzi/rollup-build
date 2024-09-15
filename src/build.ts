import type { BuildCliConfig } from './types'
import { resolve } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { EXIT_CODE, loadBuildConfig } from './config'
import { getRollupDeclarationOptions, getRollupOptions, rollupBuild } from './rollup'
import { rmdir } from './utils'

export async function build(rootDir: string, cli: BuildCliConfig = {}) {
  consola.info(`Building ${rootDir}\n`)

  const buildConfigs = await loadBuildConfig(rootDir)

  // Cleaned dirs
  const cleanedDirs: string[] = []

  for (const buildConfig of buildConfigs) {
    // output dir
    const dir = resolve(rootDir, buildConfig.outDir)

    // Clean dist dirs
    if (buildConfig.clean) {
      const isClean = !(dir === rootDir || cleanedDirs.some(c => dir.startsWith(c)))

      if (isClean) {
        cleanedDirs.push(dir)
        await rmdir(dir)
      }
    }

    const config = {
      ...buildConfig,
      outDir: dir,
      minify: cli.minify || buildConfig.minify,
    }

    const rollupOptions = getRollupOptions(config)

    await rollupBuild(rollupOptions)

    /**
     * Generates .d.ts declaration file
     */
    if (config.declaration) {
      const rollupDeclarationOptions = getRollupDeclarationOptions(config)

      await rollupBuild(rollupDeclarationOptions)
    }
  }

  consola.success(`Build succeeded!`)

  process.exit(EXIT_CODE.SUCCESS)
}
