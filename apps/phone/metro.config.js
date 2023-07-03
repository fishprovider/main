// const { getDefaultConfig } = require('@expo/metro-config');
// const defaultConfig = getDefaultConfig(__dirname);
// console.log(defaultConfig);

module.exports = {
  resolver: {
    extraNodeModules: {
      root: '../../node_modules',
    },
  },
  watchFolders: [
    '../../node_modules',
    '../../packages/utils',
    '../../packages/cross',
  ],
};
