module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: '.',
        alias: {
          '@fishbot/utils': '../../packages/utils/dist',
          '@fishbot/cross': '../../packages/cross/dist',
          '~constants': './constants',
          '~components': './components',
        },
      }],
      require.resolve('expo-router/babel'),
    ],
  };
};
