const esbuild = require('esbuild');
const pkg = require('./package.json');
const { globSync } = require('glob');

const watchMode = process.env.WATCH_MODE;

const apiOptions = {
  entryPoints: globSync('src/api/**/*.ts', { ignore: '**/*.test.*' }),
  outdir: 'dist/api',
  loader: { '.js': 'jsx', '.ts': 'tsx' },
  external: Object.keys(pkg.dependencies),
  bundle: true,
  minify: !watchMode,
  sourcemap: !watchMode,
  splitting: true,
  target: ['esnext'],
  platform: 'node',
  format: 'esm',
};

const mainOptions = {
  entryPoints: ['index.ts'],
  outdir: 'dist',
  loader: { '.js': 'jsx', '.ts': 'tsx' },
  external: Object.keys(pkg.dependencies),
  bundle: true,
  minify: !watchMode,
  sourcemap: !watchMode,
  splitting: true,
  target: ['esnext'],
  platform: 'node',
  format: 'esm',
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
