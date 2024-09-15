import fsp from 'node:fs/promises'

/**
 * Refer to path-parse
 * @param path
 */
export function pathParse(path: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-empty-alternative
  const splitPathRe = /^((\/?)(?:[^/]*\/)*)((\.{1,2}|[^/]+?|)(\.[^./]*|))\/*$/
  const parse = splitPathRe.exec(path)?.slice(1)

  if (!parse || parse.length !== 5) {
    throw new TypeError(`Invalid path '${path}'`)
  }

  return {
    root: parse[1],
    dir: parse[0].slice(0, -1),
    base: parse[2],
    ext: parse[4],
    name: parse[3],
  }
}

/**
 * Remove directories
 * @param dir
 */
export async function rmdir(dir: string): Promise<void> {
  await fsp.unlink(dir).catch(() => {})
  await fsp.rm(dir, { recursive: true, force: true }).catch(() => {})
}
