/* eslint-disable @typescript-eslint/no-var-requires */

const build = require('../../esbuild.cjs');

build(require('./package.json').dependencies);
