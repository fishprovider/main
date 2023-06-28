/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild');
const { globSync } = require('glob');

const watchMode = process.env.WATCH_MODE;
const devMode = watchMode;

const dependencies = {
  ...require('./package.json').dependencies,
  ...require('../../packages/utils/package.json').dependencies,
  ...require('../../packages/core/package.json').dependencies,
  ...require('../../packages/swap/package.json').dependencies,
  ...require('../../packages/coin/package.json').dependencies,
};

const options = {
  loader: { '.js': 'js', '.ts': 'ts' },
  external: Object.keys(dependencies),
  bundle: true,
  minify: !devMode,
  sourcemap: !devMode,
  target: ['esnext'],
  platform: 'node',
  format: 'esm',
};

const apiOptions = {
  ...options,
  entryPoints: globSync('api/**/*.ts', { ignore: '**/*.test.*' }),
  outdir: 'dist/api',
  splitting: false,
};

const mainOptions = {
  ...options,
  entryPoints: ['index.ts'],
  outdir: 'dist',
  splitting: true,
};

const main = async () => {
  if (watchMode) {
    const apiCtx = await esbuild.context(apiOptions);
    const mainCtx = await esbuild.context(mainOptions);
    await Promise.all([
      apiCtx.watch(),
      mainCtx.watch(),
    ]);
  } else {
    await esbuild.build(apiOptions);
    await esbuild.build(mainOptions);
  }
};

main();
