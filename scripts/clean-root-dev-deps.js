/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const packageJson = require('../package.json');

delete packageJson.devDependencies;

fs.writeFileSync('../package.json', JSON.stringify(packageJson, null, 2));
