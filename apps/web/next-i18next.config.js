const ChainedBackend = require('i18next-chained-backend').default;
const LocalforageBackend = require('i18next-localforage-backend').default;
const HttpBackend = require('i18next-http-backend/cjs');

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
  },
  use: typeof document !== 'undefined' ? [ChainedBackend] : [],
  backend: {
    backends: typeof document !== 'undefined' ? [LocalforageBackend, HttpBackend] : [],
    backendOptions: [{
      expirationTime: 60 * 60 * 1000,
      versions: {
        en: 'v1.0.0',
        vi: 'v1.0.0',
      },
    }, {}],
  },
  serializeConfig: false,
  // reloadOnPrerender: process.env.NODE_ENV === 'development',
  // debug: process.env.NODE_ENV === 'development',
};
