import { resolve } from 'node:path'
import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import consola from 'consola'
import { description, name, version } from '../package.json'
import { build } from './build'
import { EXIT_CODE, loadBuildConfig } from './config'
import { stub } from './stub'
import { rmdir } from './utils'

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  args: {
    dir: {
      type: 'positional',
      description: 'The directory to build',
      required: false,
    },
    stub: {
      type: 'boolean',
      description: 'Stub the package',
    },
  },
  async run({ args }) {
    const rootDir = resolve(process.cwd(), args.dir || '.')

    const buildConfigs = await loadBuildConfig(rootDir)

    // Cleaned dirs
    const cleanedDirs: string[] = []

    const run = args.stub ? stub : build

    consola.info(`${args.stub ? 'Stubbing' : 'Building'} ${rootDir}`)

    for (const buildConfig of buildConfigs) {
      // output dir
      const dir = resolve(rootDir, buildConfig.outDir)

      // Clean dist dirs
      if (buildConfig.clean) {
        const isClean = dir === rootDir || cleanedDirs.some(c => dir.startsWith(c))

        if (!isClean) {
          cleanedDirs.push(dir)
          await rmdir(dir)
        }
      }

      await run(dir, buildConfig).catch((error) => {
        consola.error(`Error ${args.stub ? 'stubbing' : 'building'} ${rootDir}: ${error}`)
        process.exit(EXIT_CODE.FATALEXCEPTION)
      })
    }

    consola.success(`${args.stub ? 'Stub' : 'Build'} succeeded!`)

    process.exit(EXIT_CODE.SUCCESS)
  },
})

runMain(main)
