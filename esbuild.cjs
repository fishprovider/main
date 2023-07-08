/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild');

const watchMode = process.env.WATCH_MODE;
const devMode = watchMode;

const packageDependencies = {
  ...require('./packages/utils/package.json').dependencies,
  ...require('./packages/ctrader/package.json').dependencies,
  ...require('./packages/metatrader/package.json').dependencies,
  ...require('./packages/swap/package.json').dependencies,
  ...require('./packages/coin/package.json').dependencies,
  ...require('./packages/core/package.json').dependencies,
};

const baseOptions = {
  entryPoints: ['index.ts'],
  outdir: 'dist',
  loader: { '.js': 'js', '.ts': 'ts' },
  bundle: true,
  splitting: true,
  minify: !devMode,
  sourcemap: !devMode,
  target: ['esnext'],
  platform: 'node',
  format: 'esm',
};

const build = async (dependencies, buildOptions) => {
  const externalDependencies = Object.keys({
    ...packageDependencies,
    ...dependencies,
  }).filter(item => !item.startsWith('@fishprovider/'));

  const options = {
    ...baseOptions,
    ...buildOptions,
    external: externalDependencies,
  };

  if (watchMode) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
  } else {
    await esbuild.build(options);
  }
};

module.exports = build;
