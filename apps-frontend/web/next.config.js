/* eslint-disable @typescript-eslint/no-var-requires */
// const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const swcConfig = {
  swcMinify: true,
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production', // remove properties matching regex ^data-test
    emotion: true,
    styledComponents: true,
  },
  modularizeImports: { // https://nextjs.org/docs/advanced-features/compiler#modularize-imports
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  transpilePackages: [
    '@fishprovider/utils',
    '@fishprovider/cross',
    '@mui/material',
    '@mui/icons-material',
  ],
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

/** @type { import('next/dist/server/config-shared').NextJsWebpackConfig } */
const webpack = (
  /** @type { import('webpack').Configuration } */
  config,
  // context,
) => {
  const newConfig = { ...config };
  if (process.env.NODE_ENV === 'development') {
    newConfig.optimization.minimize = false;
  }
  return newConfig;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  ...swcConfig,
  webpack,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // i18n,
};

const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  register: false,
  skipWaiting: false,
  runtimeCaching: require('next-pwa/cache').map((item) => {
    if (item.options.cacheName === 'apis') {
      const newItem = {
        ...item,
      };
      newItem.handler = 'StaleWhileRevalidate';
      delete newItem.options.networkTimeoutSeconds;
      return newItem;
    }
    return item;
  }),
});

const { withSentryConfig } = require('@sentry/nextjs');

const withSentry = (config) => withSentryConfig(
  config,
  {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'fishprovider',
    // project: 'prod',
  },
  {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    // transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to
    // circumvent ad-blockers (increases server load)
    // tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = [
  withPWA,
  withSentry,
  withBundleAnalyzer,
].reduce((finalConfig, pluginFn) => pluginFn(finalConfig), nextConfig);
