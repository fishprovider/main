/** @type {import('jest').Config} */
module.exports = {
  setupFiles: ["<rootDir>/../../jest.setupFiles.js"],
  setupFilesAfterEnv: ["<rootDir>/../../jest.setupFilesAfterEnv.js"],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/$1',
  },

  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true, // avoid OOM
      },
    ],
  },
  forceExit: true,
};
