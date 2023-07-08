process.env.TAMAGUI_TARGET = 'native';

module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'transform-inline-environment-variables',
        {
          include: 'TAMAGUI_TARGET',
        },
      ],
      ['module-resolver', {
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
      }],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
      require.resolve('expo-router/babel'),
    ],
  };
};
