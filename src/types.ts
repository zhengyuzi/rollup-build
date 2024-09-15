import type { InputPluginOption } from 'rollup'
import type { ExternalsOptions as RollupExternalsOptions } from 'rollup-plugin-node-externals'

export interface BuildDefaultConfig {
  /**
   * Build entries
   */
  entries: string[]
  /**
   * Output directory
   */
  outDir: string
  /**
   * Clean dist dirs
   */
  clean: boolean
  /**
   * Generates .d.ts declaration file
   */
  declaration: boolean
  /**
   * Generates a CommonJS build
   */
  emitCJS: boolean
  /**
   * Minify build
   */
  minify: boolean
  /**
   * Used to specify which modules or libraries should be considered external dependencies and not included in the final build product.
   */
  externals: RollupExternalsOptions
  /**
   * Configure rollup plugins
   */
  plugins: InputPluginOption[]
}

export type BuildConfig = Partial<BuildDefaultConfig>

export interface BuildDefineConfig {
  source: BuildConfig[]
}

export interface BuildCliConfig {
  minify?: boolean
}

export function defineConfig(
  config: BuildConfig | BuildConfig[],
): BuildDefineConfig {
  return {
    source: (Array.isArray(config) ? config : [config]).filter(Boolean),
  }
}
