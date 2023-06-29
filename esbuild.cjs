/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild');

const watchMode = process.env.WATCH_MODE;
const devMode = watchMode;

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

const build = async (buildOptions) => {
  const options = {
    ...baseOptions,
    ...buildOptions,
  };
  if (watchMode) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
  } else {
    await esbuild.build(options);
  }
};

module.exports = build;
