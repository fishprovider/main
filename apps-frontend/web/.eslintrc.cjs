// @ts-ignore ignore
const config = require('../../.eslintrc.cjs');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...config,
  ignorePatterns: [
    ...config.ignorePatterns,
    'public',
  ],
  extends: [
    ...config.extends,
    'next/core-web-vitals',
  ],
};
