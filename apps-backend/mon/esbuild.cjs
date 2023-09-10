const build = require('../../esbuild.cjs');

build(require('./package.json').dependencies, {
  entryPoints: ['index.ts', 'immortal.ts'],
});
