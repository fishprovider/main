const baseConfig = require('./jest.config.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  setupFiles: ['<rootDir>/../../jest.setupFiles.js'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setupFilesAfterEnv.js'],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/$1',
  },
  preset: 'ts-jest/presets/default-esm',
  transform: {
    [baseConfig.tsJestFilePattern]: [
      'ts-jest',
      baseConfig.tsJestOptions,
    ],
  },
  forceExit: true,
};
