import type { BuildDefaultConfig } from './types'
import { resolve } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import fs from 'fs-extra'
import { resolveModuleExportNames } from 'mlly'
import { pathParse } from './utils'

const extensions = ['.ts', '.js', '.mjs']

export async function stub(dir: string, buildConfig: BuildDefaultConfig) {
  for (const entry of buildConfig.entries) {
    const { name } = pathParse(entry)

    const entryPath = resolve(process.cwd(), entry)

    const path = await findEntryFilePath(entryPath)

    const data = await getStubData(path)

    const output = resolve(dir, name)

    await fs.outputFile(`${output}.mjs`, String(data.import)).then(() => {
      consola.success(`${output}.mjs`)
    })

    if (buildConfig.emitCJS) {
      await fs.outputFile(`${output}.cjs`, String(data.require)).then(() => {
        consola.success(`${output}.cjs`)
      })
    }

    if (buildConfig.declaration) {
      await fs.outputFile(`${output}.d.ts`, String(data.types)).then(() => {
        consola.success(`${output}.d.ts`)
      })
    }
  }
}

async function getStubData(path: string) {
  const namedExports = await resolveModuleExportNames(path, { extensions })

  const noExport = namedExports.length === 0

  const hasDefaultExport = namedExports.includes('default')

  const _path = path.replace(/\\/g, '/')

  return noExport
    ? {
        import: `import '${_path}'`,
        require: `require('${_path}')`,
        types: '',
      }
    : {
        import: [`export * from '${_path}'`, hasDefaultExport ? `export { default } from '${_path}'` : ''].join('\n'),
        require: `module.exports = require('${_path}')`,
        types: [`export * from '${_path}'`, hasDefaultExport ? `export { default } from '${_path}'` : ''].join('\n'),
      }
}

async function findEntryFilePath(entry: string) {
  const ext = extensions.find(e => fs.existsSync(`${entry}${e}`))

  const path = `${entry}${ext || ''}`

  return path
}
