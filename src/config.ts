import type {
  BuildDefaultConfig,
  BuildDefineConfig,
} from './types'
import process from 'node:process'
import { loadConfig } from 'c12'

export const EXIT_CODE = {
  SUCCESS: 0,
  INVALIDARGUMENT: 9,
  FATALEXCEPTION: 1,
}

export const defaultConfig: BuildDefaultConfig = {
  entries: ['src/index'],
  outDir: 'dist',
  clean: false,
  declaration: false,
  emitCJS: false,
  minify: false,
  externals: {},
  plugins: [],
}

export async function loadBuildConfig(cwd = process.cwd()) {
  const { config } = await loadConfig<BuildDefineConfig>({
    name: 'build',
    cwd,
  })

  return config.source.map((item) => {
    return { ...defaultConfig, ...item }
  }) as BuildDefaultConfig[]
}
