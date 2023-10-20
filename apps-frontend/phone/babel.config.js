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
            '~components': './components',
            '~constants': './constants',
            '~controllers': './controllers',
            '~hooks': './hooks',
            '~libs': './libs',
            '~navigators': './navigators',
            '~services': './services',
            '~ui': './ui',
            '~utils': './utils',
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
