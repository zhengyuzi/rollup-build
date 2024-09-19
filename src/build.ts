import type { BuildDefaultConfig } from './types'
import { getRollupDeclarationOptions, getRollupOptions, rollupBuild } from './rollup'

export async function build(dir: string, buildConfig: BuildDefaultConfig) {
  const config = {
    ...buildConfig,
    outDir: dir,
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
