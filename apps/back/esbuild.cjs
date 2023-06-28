const esbuild = require('esbuild');
const pkg = require('./package.json');
const { globSync } = require('glob');

const buildApi = () => {
  const routeFiles = globSync('src/api/**/*.ts', { ignore: '**/*.test.*' });

  const options = {
    entryPoints: routeFiles,
    outdir: 'dist/api',
    loader: { '.js': 'jsx', '.ts': 'tsx' },
    external: Object.keys(pkg.dependencies),
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true,
    target: ['esnext'],
    platform: 'node',
    format: 'esm',
  };

  return esbuild.build(options);
};

const buildMain = () => {
  const options = {
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    loader: { '.js': 'jsx', '.ts': 'tsx' },
    external: Object.keys(pkg.dependencies).filter((item) => !item.startsWith('@fishbot')),
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true,
    target: ['esnext'],
    platform: 'node',
    format: 'esm',
  };

  return esbuild.build(options);
};

const build = async () => {
  await buildApi();
  await buildMain();
};

build();
