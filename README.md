# @zhengyuzi/rollup-build

An ES module bundler based on Rollup.

## Install

```bash
npm install --save-dev @zhengyuzi/rollup-build
```

## Usage

Add the build command to ```package.json```

```json
{
  "scripts": {
    "build": "robuild"
  }
}
```

Create ```build.config.ts```

```js
import { defineConfig } from '@zhengyuzi/rollup-build'

export default defineConfig({
  entries: [
    'src/index',
  ],
})
```

## Configuration

### entries

Build entries.

### outDir

Output directory.

### clean

Clean dist dirs.

### declaration

Generates .d.ts declaration file.

### emitCJS

Minify build.

### externals

View [rollup-plugin-node-externals](https://github.com/Septh/rollup-plugin-node-externals)

### plugins

Add rollup plugin.

## Reference

- [rollup](https://github.com/rollup/rollup)
- [unbuild](https://github.com/unjs/unbuild)
