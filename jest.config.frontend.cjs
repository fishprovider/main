const baseConfig = require('./jest.config.base.cjs');
const defaultConfig = require('./jest.config.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...defaultConfig,
  testEnvironment: 'jsdom',
  transform: {
    ...defaultConfig.transform,
    [baseConfig.tsJestFilePattern]: [
      'ts-jest',
      {
        ...baseConfig.tsJestOptions,
        tsconfig: '<rootDir>/../../tsconfig.frontend.test.json',
      },
    ],
  },
};
