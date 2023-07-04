/* eslint-disable @typescript-eslint/no-var-requires */

// https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js
// https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/index.js

// @ts-ignore no need to include in tsconfig
const config = require('../../.eslintrc.cjs');

module.exports = {
  ...config,
  // each following rule set will extend or overwrite the previous ones
  extends: [
    ...config.extends,
    'next/core-web-vitals',
  ],
};
