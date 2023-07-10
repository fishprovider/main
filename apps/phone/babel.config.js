process.env.TAMAGUI_TARGET = 'native';
process.env.EXPO_PUBLIC_BACKEND_URL = 'https://back.fishprovider.com';

// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'transform-inline-environment-variables',
        {
          include: [
            'EXPO_PUBLIC_BACKEND_URL',
            'TAMAGUI_TARGET',
          ],
        },
      ],
      [
        'module-resolver',
        {
          root: '.',
          alias: {
            '@fishprovider/utils': '../../packages/utils/dist',
            '@fishprovider/cross': '../../packages/cross/dist',
            // Note that '~': '.' does not work
            '~constants': './constants',
            '~utils': './utils',
            '~libs': './libs',
            '~hooks': './hooks',
            '~ui': './ui',
            '~components': './components',
            '~controllers': './controllers',
            '~layouts': './layouts',
            '~views': './views',
          },
        },
      ],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
