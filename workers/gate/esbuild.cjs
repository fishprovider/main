/* eslint-disable @typescript-eslint/no-var-requires */

const build = require('../../esbuild.cjs');

const dependencies = {
  ...require('./package.json').dependencies,
  ...require('../../packages/utils/package.json').dependencies,
  ...require('../../packages/swap/package.json').dependencies,
  ...require('../../packages/core/package.json').dependencies,
};

build({
  external: Object.keys(dependencies),
});
