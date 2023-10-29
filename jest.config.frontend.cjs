/** @type {import('jest').Config} */
module.exports = {
  ...require('./jest.config.cjs'),
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: '<rootDir>/../../tsconfig.test.frontend.json',
      },
    ],
  },
};
