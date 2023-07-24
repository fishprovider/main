process.env.TAMAGUI_TARGET = 'native';

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
            'TAMAGUI_TARGET',
          ],
        },
      ],
      [
        'module-resolver',
        {
          root: '.',
          alias: {
            // Note that '~': '.' does not work
            '~constants': './constants',
            '~utils': './utils',
            '~libs': './libs',
            '~hooks': './hooks',
            '~ui': './ui',
            '~components': './components',
            '~controllers': './controllers',
            '~layouts': './layouts',
            '~navigators': './navigators',
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
