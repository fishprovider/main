/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const { globSync } = require('glob');
const rootPackageJson = require('../package.json');

const result = {
  deleted: 0,
  updated: 0,
};

const packageJsonFiles = rootPackageJson.workspaces
  .map((item) => `../${item}/package.json`)
  .flatMap((item) => globSync(item));
// console.log(packageJsonFiles);

const dependenciesWorkspaces = {};
const dependenciesVersionMismatch = [];
packageJsonFiles.forEach((item) => {
  const { dependencies, devDependencies } = require(item);
  Object.entries(dependencies || {}).forEach(([name, version]) => {
    if (dependenciesWorkspaces[name] && dependenciesWorkspaces[name] !== version) {
      dependenciesVersionMismatch.push({ name, version });
    } else {
      dependenciesWorkspaces[name] = version;
    }
  });
  Object.entries(devDependencies || {}).forEach(([name, version]) => {
    if (dependenciesWorkspaces[name] && dependenciesWorkspaces[name] !== version) {
      dependenciesVersionMismatch.push({ name, version });
    } else {
      dependenciesWorkspaces[name] = version;
    }
  });
});
if (dependenciesVersionMismatch.length) {
  console.error('Dependencies version mismatch', dependenciesVersionMismatch);
  process.exit(1);
}

const dependenciesAll = packageJsonFiles.flatMap((item) => {
  const { dependencies, devDependencies } = require(item);
  return [
    ...Object.entries(dependencies || {})
      .filter(([name]) => !name.startsWith('@fishprovider'))
      .map(([name, version]) => ({ name, version })),
    ...Object.entries(devDependencies || {})
      .filter(([name]) => !name.startsWith('@fishprovider'))
      .map(([name, version]) => ({ name, version })),
  ];
});
// console.log(dependenciesAll);

const devDependenciesOnly = [
  '@jest/globals',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@types/d3-format',
  '@types/d3-time-format',
  '@types/dotenv-flow',
  '@types/jest',
  '@types/lqip-modern',
  '@types/node',
  '@types/node-telegram-bot-api',
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
Object.entries(rootPackageJson.devDependencies)
  .filter(([name]) => !devDependenciesOnly.includes(name))
  .forEach(([name, version]) => {
    if (!dependenciesAll.some((item) => item.name === name && item.version === version)) {
      console.log(`Redundant package: "${name}": "${version}"`);
      delete rootPackageJson.devDependencies[name];
      result.deleted += 1;
    }
  });

const devDependenciesRoot = rootPackageJson.devDependencies;
dependenciesAll.forEach(({ name, version }) => {
  if (!devDependenciesRoot[name] || devDependenciesRoot[name] !== version) {
    console.log(`Update package: "${name}": "${version}"`);
    devDependenciesRoot[name] = version;
    result.updated += 1;
  }
});

console.log('Done', result);
if (result.deleted || result.updated) {
  rootPackageJson.devDependencies = devDependenciesRoot;
  fs.writeFileSync('../package.json', JSON.stringify(rootPackageJson, null, 2));
  process.exit(1);
}
