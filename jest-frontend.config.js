/** @type {import('jest').Config} */
module.exports = {
  ...require('./jest.config.cjs'),
  testEnvironment: 'jsdom',
};
