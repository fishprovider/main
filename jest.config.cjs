/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  setupFiles: ['<rootDir>/jest.setupFiles.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setupFilesAfterEnv.js'],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/$1',
    '.(css|less|scss)$': 'identity-obj-proxy',
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
