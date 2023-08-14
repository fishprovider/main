const { globSync } = require('glob');
const rootPackageJson = require('../package.json');

const workSpaceDirs = rootPackageJson.workspaces.flatMap((item) => globSync(item));
// console.log(workSpaceDirs);

const config = {};
workSpaceDirs.forEach(workSpaceDir => {
  config[`${workSpaceDir}/**/*.{js,jsx,ts,tsx}`] = `npm run -w ${workSpaceDir} ci-lint`;
  config[`${workSpaceDir}/**/*.{ts,tsx}`] = `npm run -w ${workSpaceDir} ci-type-check`;
})
// console.log(config);

module.exports = config;
