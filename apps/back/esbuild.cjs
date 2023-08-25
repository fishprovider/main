const { globSync } = require('glob');
const build = require('../../esbuild.cjs');
const { dependencies } = require('./package.json');

const watchMode = process.env.WATCH_MODE;

const apiOptions = {
  entryPoints: globSync('api/**/*.ts', { ignore: '**/*.test.*' }),
  outdir: 'dist/api',
  splitting: false,
};

const apiV2Options = {
  entryPoints: globSync('apiV2/**/*.ts', { ignore: '**/*.test.*' }),
  outdir: 'dist/apiV2',
  splitting: false,
};

const main = async () => {
  if (watchMode) {
    await Promise.all([
      await build(dependencies, apiOptions),
      await build(dependencies, apiV2Options),
      await build(dependencies),
    ]);
  } else {
    await build(dependencies, apiOptions);
    await build(dependencies, apiV2Options);
    await build(dependencies);
  }
};

main();
