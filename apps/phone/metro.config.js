/* eslint-disable @typescript-eslint/no-var-requires */

const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  watchFolders: [
    '../../node_modules',
    '../../packages/utils',
    '../../packages/cross',
  ],
};
