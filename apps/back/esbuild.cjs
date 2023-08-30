const { globSync } = require('glob');
const build = require('../../esbuild.cjs');
const { dependencies } = require('./package.json');

const watchMode = process.env.WATCH_MODE;

const apiOptions = {
  entryPoints: globSync('api/**/*.ts', { ignore: '**/*.test.*' }),
  outdir: 'dist/api',
  splitting: false,
};

const apiV3Options = {
  entryPoints: globSync('apiV3/**/*.ts', { ignore: '**/*.test.*' }),
  outdir: 'dist/apiV3',
  splitting: false,
};

const main = async () => {
  if (watchMode) {
    await Promise.all([
      await build(dependencies, apiOptions),
      await build(dependencies, apiV3Options),
      await build(dependencies),
    ]);
  } else {
    await build(dependencies, apiOptions);
    await build(dependencies, apiV3Options);
    await build(dependencies);
  }
};

main();
