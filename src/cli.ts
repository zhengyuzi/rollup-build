import { resolve } from 'node:path'
import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import consola from 'consola'
import stubb from 'stubb'
import { description, name, version } from '../package.json'
import { build } from './build'
import { EXIT_CODE } from './config'

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
    minify: {
      type: 'boolean',
      description: 'Minify build',
    },
  },
  async run({ args }) {
    const rootDir = resolve(process.cwd(), args.dir || '.')

    if (args.stub) {
      await stubb().catch((error) => {
        consola.error(`Error stub ${rootDir}: ${error}`)
        process.exit(EXIT_CODE.FATALEXCEPTION)
      })
    }
    else {
      await build(rootDir, {
        minify: args.minify,
      }).catch((error) => {
        consola.error(`Error building ${rootDir}: ${error}`)
        process.exit(EXIT_CODE.FATALEXCEPTION)
      })
    }
  },
})

runMain(main)
