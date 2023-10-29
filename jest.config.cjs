/** @type {import('jest').Config} */
module.exports = {
  setupFiles: ['<rootDir>/../../jest.setupFiles.js'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setupFilesAfterEnv.js'],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  forceExit: true,
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: '<rootDir>/../../tsconfig.test.json',
      },
    ],
  },
};
