const build = require('../../esbuild.cjs');

build(require('./package.json').dependencies);
