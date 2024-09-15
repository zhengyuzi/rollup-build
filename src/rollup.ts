import type { OutputChunk, OutputOptions, RollupOptions } from 'rollup'
import type { BuildDefaultConfig } from './types'
import { Buffer } from 'node:buffer'
import { resolve } from 'node:path'
import Commonjs from '@rollup/plugin-commonjs'
import Json from '@rollup/plugin-json'
import { nodeResolve as NodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import Typescript from '@rollup/plugin-typescript'
import consola from 'consola'
import { filesize } from 'filesize'
import { gzipSizeSync } from 'gzip-size'
import { rollup } from 'rollup'
import { dts as Dts } from 'rollup-plugin-dts'
import Externals from 'rollup-plugin-node-externals'
import { pathParse } from './utils'

export function getRollupOptions(config: BuildDefaultConfig): RollupOptions {
  const { entries, outDir, emitCJS, externals, minify } = config

  const output = [
    {
      format: 'esm',
      dir: outDir,
      entryFileNames: '[name].mjs',
    },
    emitCJS && {
      format: 'cjs',
      dir: outDir,
      entryFileNames: '[name].cjs',
    },
  ].filter(Boolean) as OutputOptions[]

  const plugins = [
    Externals(externals),
    Json(),
    Typescript(),
    NodeResolve({
      extensions: ['.ts', '.tsx', '.mts', '.cts', '.mjs', '.cjs', '.js', '.jsx', '.json'],
    }),
    Commonjs(),
    minify && terser(),
    ...(config.plugins || []),
  ].filter(Boolean)

  return {
    input: entries,
    output,
    plugins,
  }
}

export function getRollupDeclarationOptions(config: BuildDefaultConfig): RollupOptions {
  const { entries, outDir } = config

  const input = entries.reduce((pre, entry) => {
    const { name, ext } = pathParse(entry)
    pre[name] = !ext ? `${entry}.ts` : entry
    return pre
  }, {} as { [key: string]: string })

  const output = [
    {
      format: 'es',
      dir: outDir,
      entryFileNames: '[name].d.ts',
    },
  ] as OutputOptions[]

  const plugins = [
    Dts(),
  ]

  return {
    input,
    output,
    plugins,
  }
}

export async function rollupBuild(option: RollupOptions) {
  const buildResult = await rollup(option)

  const allOutputOptions = option.output as OutputOptions[]

  for (const outputOptions of allOutputOptions) {
    const { output: outputs } = await buildResult.write(outputOptions)

    for (const output of outputs) {
      // Output file path
      const filepath = resolve(outputOptions.dir!, output.fileName)

      // Packaged code content
      const code = (output as OutputChunk).code

      // Retrieve file size and gzip size based on code
      const bundleSize = filesize(Buffer.byteLength(code))
      const gzippedSize = filesize(gzipSizeSync(code))

      consola.success(
        `${filepath}`,
        ` - Bundle size: ${bundleSize}`,
        ` - Gzipped size: ${gzippedSize}\n`,
      )
    }
  }
}
