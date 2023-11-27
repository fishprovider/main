/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */

const { globSync } = require('glob');
const rootPackageJson = require('../package.json');

const ORG_NAME = '@fishprovider';

const ACTIVE_DEV_DEPS = [
  '@jest/globals',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@tsconfig/node-lts-strictest-esm',
  '@types/jest',
  '@types/node',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'concurrently',
  'eslint',
  'eslint-config-airbnb',
  'eslint-config-airbnb-typescript',
  'eslint-config-next',
  'eslint-plugin-simple-import-sort',
  'husky',
  'identity-obj-proxy',
  'jest',
  'jest-environment-jsdom',
  'lint-staged',
  'nodemon',
  'ts-jest',
  'ts-node',
  'tsc-files',
  'tsc-watch',
];

const packageJsonFiles = rootPackageJson.workspaces
  .map((item) => `../${item}/package.json`)
  .flatMap((item) => globSync(item));

const getAllDependencies = () => packageJsonFiles.flatMap((item) => {
  const { dependencies, devDependencies } = require(item);
  return [
    ...Object.entries(dependencies || {})
      .filter(([name]) => !name.startsWith(ORG_NAME))
      .map(([name, version]) => ({ name, version })),
    ...Object.entries(devDependencies || {})
      .filter(([name]) => !name.startsWith(ORG_NAME))
      .map(([name, version]) => ({ name, version })),
  ];
});

const allDependencies = getAllDependencies();

const unusedDeps = Object.entries(rootPackageJson.devDependencies).filter(([name, version]) => {
  if (ACTIVE_DEV_DEPS.includes(name)) return false;
  return !allDependencies.some((item) => item.name === name && item.version === version);
});

if (unusedDeps.length > 0) {
  console.warn(`${unusedDeps.length} unused devDependencies found`);
  unusedDeps.forEach(([name]) => console.warn(`'${name}',`));
  process.exit(1);
}
