/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */

/*
  What: This script checks if all projects have the same version of dependencies and fixes them
  Why:
    - This is to avoid having different versions of the same dependency in different projects
    - By having the same versions of the same dependency, all dependencies are placed under
      the same node_modules folder at the root folder of the monorepo
    - In some special cases, we need to have different versions of the same dependency,
      those dependencies will be placed under the node_modules folder of the project
      (not at the root folder of the monorepo), e.g apps/backend/node_modules
  How:
    - It reads all package.json files in all workspaces and checks if the dependencies are the same
    - If there are different versions of the same dependency, it will print out the name and version
    - It will then update the root package.json file with the latest version of the dependencies
    - Note that all in the root package.json file, all dependencies are devDependencies

  Usage:
    cd scripts && node check-deps.cjs
    // or
    npm run check-deps
    // or
    npm run doctor
*/

const fs = require('fs');
const { globSync } = require('glob');
const rootPackageJson = require('../package.json');

const ORG_NAME = '@fishprovider';

const packageJsonFiles = rootPackageJson.workspaces
  .map((item) => `../${item}/package.json`)
  .flatMap((item) => globSync(item));

//
// utils
//

const getVersionMismatchDependencies = () => {
  const dependenciesWorkspaces = {};
  const dependenciesVersionMismatch = [];

  packageJsonFiles.forEach((item) => {
    const { dependencies = {}, devDependencies = {} } = require(item);

    [...Object.entries(dependencies), ...Object.entries(devDependencies)]
      .forEach(([name, version]) => {
        if (dependenciesWorkspaces[name] && dependenciesWorkspaces[name] !== version) {
          console.warn('Version mismatch', name, dependenciesWorkspaces[name], version);
          dependenciesVersionMismatch.push({ name, version });
        } else {
          dependenciesWorkspaces[name] = version;
        }
      });
  });

  return dependenciesVersionMismatch;
};

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

const getRootDevDependencies = () => {
  const rootDevDependencies = {
    ...rootPackageJson.devDependencies,
  };
  const allDependencies = getAllDependencies();

  let updated = 0;

  allDependencies.forEach(({ name, version }) => {
    if (!rootDevDependencies[name] || rootDevDependencies[name] !== version) {
      rootDevDependencies[name] = version;
      updated += 1;
      console.warn(`[${updated}] Updated package`, `"${name}": "${version}"`);
    }
  });

  return {
    updated,
    rootDevDependencies,
  };
};

//
// main
//

const dependenciesVersionMismatch = getVersionMismatchDependencies();
if (dependenciesVersionMismatch.length) {
  console.warn('Please resolve to use the same version', dependenciesVersionMismatch);
}

const { updated, rootDevDependencies } = getRootDevDependencies();
if (updated) {
  console.info(`Updated ${updated} rootDevDependencies`);
  rootPackageJson.devDependencies = rootDevDependencies;
  fs.writeFileSync('../package.json', JSON.stringify(rootPackageJson, null, 2));
  process.exit(1);
}
