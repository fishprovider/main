/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

const watchMode = process.env.WATCH_MODE;
const devMode = watchMode;

const packageDependencies = {
  ...require('./packages/utils/package.json').dependencies,
  ...require('./packages/ctrader/package.json').dependencies,
  ...require('./packages/metatrader/package.json').dependencies,
  ...require('./packages/binance/package.json').dependencies,
  ...require('./packages/swap/package.json').dependencies,
  ...require('./packages/coin/package.json').dependencies,
  ...require('./packages/core/package.json').dependencies,
  // new
  ...require('./packages-share/core/package.json').dependencies,

  ...require('./packages-backend/core-backend/package.json').dependencies,

  ...require('./packages-backend/queue/package.json').dependencies,

  ...require('./packages-backend/slack/package.json').dependencies,
  ...require('./packages-backend/discord/package.json').dependencies,
  ...require('./packages-backend/expo/package.json').dependencies,
  ...require('./packages-backend/notif/package.json').dependencies,

  ...require('./packages-backend/firebase/package.json').dependencies,
  ...require('./packages-backend/mongo/package.json').dependencies,
  ...require('./packages-backend/redis/package.json').dependencies,
  ...require('./packages-backend/cache-first/package.json').dependencies,

  ...require('./packages-backend/ctrader-api/package.json').dependencies,
  ...require('./packages-backend/metatrader-api/package.json').dependencies,
  ...require('./packages-backend/meta-api/package.json').dependencies,
  ...require('./packages-backend/trade/package.json').dependencies,
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
  });

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
