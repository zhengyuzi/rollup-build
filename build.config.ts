import { defineConfig } from './src'

export default defineConfig([
  {
    entries: [
      'src/index',
    ],
    declaration: true,
    clean: true,
  },
  {
    entries: [
      'src/cli',
    ],
    clean: true,
  },
])
