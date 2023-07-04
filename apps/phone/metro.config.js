/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */

const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
// console.log('Default Metro Config', defaultConfig);

module.exports = {
  ...defaultConfig,
  watchFolders: [
    '../../node_modules',
    '../../packages/utils',
    '../../packages/cross',
  ],
};

/* Default Metro Config
{
  resolver: {
    assetExts: [
      'bmp',  'gif',  'jpg',  'jpeg',
      'png',  'psd',  'svg',  'webp',
      'm4v',  'mov',  'mp4',  'mpeg',
      'mpg',  'webm', 'aac',  'aiff',
      'caf',  'm4a',  'mp3',  'wav',
      'html', 'pdf',  'yaml', 'yml',
      'otf',  'ttf',  'zip',  'heic',
      'avif'
    ],
    assetResolutions: [ '1', '1.5', '2', '3', '4' ],
    platforms: [ 'ios', 'android', 'native', 'testing' ],
    sourceExts: [ 'ts', 'tsx', 'js', 'jsx', 'json' ],
    blockList: /(\/__tests__\/.*)$/,
    dependencyExtractor: undefined,
    disableHierarchicalLookup: false,
    emptyModulePath: '/Users/marco/work/fish/main/node_modules/metro-config/node_modules/metro-runtime/src/modules/empty-module.js',
    extraNodeModules: {},
    hasteImplModulePath: undefined,
    nodeModulesPaths: [
      '/Users/marco/work/fish/main/apps/phone',
      '/Users/marco/work/fish/main/node_modules'
    ],
    resolveRequest: null,
    resolverMainFields: [ 'react-native', 'browser', 'main' ],
    useWatchman: true,
    requireCycleIgnorePatterns: [ /(^|\/|\\)node_modules($|\/|\\)/ ]
  },
  serializer: {
    polyfillModuleNames: [],
    getRunModuleStatement: [Function: getRunModuleStatement],
    getPolyfills: [Function: getPolyfills],
    postProcessBundleSourcemap: [Function: postProcessBundleSourcemap],
    getModulesRunBeforeMainModule: [Function: getModulesRunBeforeMainModule],
    processModuleFilter: [Function: processModuleFilter],
    createModuleIdFactory: [Function: createModuleIdFactory],
    experimentalSerializerHook: [Function: experimentalSerializerHook],
    customSerializer: null
  },
  server: {
    enhanceMiddleware: [Function: enhanceMiddleware],
    experimentalImportBundleSupport: false,
    port: 19000,
    rewriteRequestUrl: [Function: rewriteRequestUrl],
    runInspectorProxy: true,
    unstable_serverRoot: '/Users/marco/work/fish/main/apps/phone',
    useGlobalHotkey: true,
    verifyConnections: false
  },
  symbolicator: { customizeFrame: [Function: customizeFrame] },
  transformer: {
    assetPlugins: [
      '/Users/marco/work/fish/main/node_modules/expo-asset/tools/hashAssetFiles.js'
    ],
    asyncRequireModulePath: 'metro-runtime/src/modules/asyncRequire',
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
    babelTransformerPath: '/Users/marco/work/fish/main/node_modules/metro-react-native-babel-transformer/src/index.js',
    dynamicDepsInPackages: 'throwAtRuntime',
    enableBabelRCLookup: true,
    enableBabelRuntime: true,
    getTransformOptions: [AsyncFunction: getTransformOptions],
    globalPrefix: '',
    hermesParser: false,
    minifierConfig: {
      mangle: [Object],
      output: [Object],
      sourceMap: [Object],
      toplevel: false,
      compress: [Object]
    },
    minifierPath: 'metro-minify-terser',
    optimizationSizeLimit: 153600,
    transformVariants: { default: {} },
    workerPath: 'metro/src/DeltaBundler/Worker',
    publicPath: '/assets',
    allowOptionalDependencies: true,
    unstable_allowRequireContext: true,
    unstable_collectDependenciesPath: 'metro/src/ModuleGraph/worker/collectDependencies.js',
    unstable_dependencyMapReservedName: null,
    unstable_disableModuleWrapping: false,
    unstable_disableNormalizePseudoGlobals: false,
    unstable_compactOutput: false
  },
  watcher: {
    additionalExts: [ 'cjs', 'mjs' ],
    watchman: { deferStates: [Array] },
    healthCheck: {
      enabled: false,
      filePrefix: '.metro-health-check',
      interval: 30000,
      timeout: 5000
    }
  },
  cacheStores: [
    FileStore {
      _root: '/var/folders/9f/sdxnsyz97cv3w0sdkv_hxpjw0000gn/T/metro-cache'
    }
  ],
  cacheVersion: '1.0',
  projectRoot: '/Users/marco/work/fish/main/apps/phone',
  stickyWorkers: true,
  watchFolders: [
    '/Users/marco/work/fish/main/node_modules',
    '/Users/marco/work/fish/main/packages/binance',
    '/Users/marco/work/fish/main/packages/coin',
    '/Users/marco/work/fish/main/packages/core',
    '/Users/marco/work/fish/main/packages/cross',
    '/Users/marco/work/fish/main/packages/ctrader',
    '/Users/marco/work/fish/main/packages/metatrader',
    '/Users/marco/work/fish/main/packages/swap',
    '/Users/marco/work/fish/main/packages/utils',
    '/Users/marco/work/fish/main/workers/bot',
    '/Users/marco/work/fish/main/workers/copy',
    '/Users/marco/work/fish/main/workers/cron',
    '/Users/marco/work/fish/main/workers/gate',
    '/Users/marco/work/fish/main/workers/head-ctrader',
    '/Users/marco/work/fish/main/workers/head-meta',
    '/Users/marco/work/fish/main/workers/mon',
    '/Users/marco/work/fish/main/workers/pay',
    '/Users/marco/work/fish/main/workers/pup',
    '/Users/marco/work/fish/main/workers/spot-ctrader',
    '/Users/marco/work/fish/main/workers/spot-meta',
    '/Users/marco/work/fish/main/apps/back',
    '/Users/marco/work/fish/main/apps/phone',
    '/Users/marco/work/fish/main/apps/web'
  ],
  transformerPath: 'metro-transform-worker',
  maxWorkers: 8,
  resetCache: false
}
*/
