const env = {
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  liveHostNames: process.env.NEXT_PUBLIC_LIVE_HOSTNAMES || '',
};

export const prodHostnameDefault = 'www.fishprovider.com';
export const demoProdHostnameDefault = 'demo.fishprovider.com';

export const secondaryProdHostname = 'www-secondary.fishprovider.com';
export const secondaryBackendUrl = 'https://back-secondary.fishprovider.com';

const prodHostnames = [
  prodHostnameDefault,
  demoProdHostnameDefault,
];

const liveHostNames = [
  'www.fishprovider.com',
  'www-secondary.fishprovider.com',
  'canary.fishprovider.com',
  ...env.liveHostNames.split(','),
];

// for skip running during SSG/SSR
export const isBrowser = typeof document !== 'undefined';

export const isLive = !isBrowser || liveHostNames.includes(window.location.hostname);

const isProdHostnames = isBrowser && prodHostnames.includes(window.location.hostname);

const isNoTrack = isBrowser && window.location.search.includes('notrack=true');

export const isTrack = isBrowser && isProdHostnames && !isNoTrack;

export const isProd = env.nodeEnv === 'production';

export const refreshMS = isProd ? 1000 * 5 : 1000 * 60;
