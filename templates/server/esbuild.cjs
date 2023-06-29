/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild');

const watchMode = process.env.WATCH_MODE;
const devMode = watchMode;

const dependencies = {
  ...require('./package.json').dependencies,
  ...require('../../packages/utils/package.json').dependencies,
  ...require('../../packages/swap/package.json').dependencies,
  ...require('../../packages/core/package.json').dependencies,
};

const options = {
  entryPoints: ['index.ts'],
  outdir: 'dist',
  loader: { '.js': 'js', '.ts': 'ts' },
  external: Object.keys(dependencies),
  bundle: true,
  splitting: true,
  minify: !devMode,
  sourcemap: !devMode,
  target: ['esnext'],
  platform: 'node',
  format: 'esm',
};

const main = async () => {
  if (watchMode) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
  } else {
    await esbuild.build(options);
  }
};

main();
