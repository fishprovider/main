process.env.TAMAGUI_TARGET = 'native';
process.env.EXPO_PUBLIC_BACKEND_URL = 'https://back.fishprovider.com';
process.env.EXPO_PUBLIC_SOCKET_URL = 'wss://back.fishprovider.com';
process.env.EXPO_PUBLIC_DEMO_BACKEND_URL = 'https://back-demo.fishprovider.com';
process.env.EXPO_PUBLIC_DEMO_SOCKET_URL = 'wss://back-demo.fishprovider.com';

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
            'EXPO_PUBLIC_BACKEND_URL',
            'EXPO_PUBLIC_SOCKET_URL',
            'EXPO_PUBLIC_DEMO_BACKEND_URL',
            'EXPO_PUBLIC_DEMO_SOCKET_URL',
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
