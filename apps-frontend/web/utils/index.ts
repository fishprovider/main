const env = {
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  liveHostNames: process.env.NEXT_PUBLIC_LIVE_HOSTNAMES || '',
};

export const prodHostname = 'www.fishprovider.com';
export const prodDemoHostname = 'demo.fishprovider.com';

const liveHostNames = [
  'www.fishprovider.com',
  'www-secondary.fishprovider.com',
  'canary.fishprovider.com',
  'dev.fishprovider.com',
  ...env.liveHostNames.split(','),
];

const prodHostnames = [
  prodHostname,
  prodDemoHostname,
];

export const isBrowser = typeof document !== 'undefined';

export const isLive = !isBrowser || liveHostNames.includes(window.location.hostname);

export const isProdHostnames = isBrowser && prodHostnames.includes(window.location.hostname);

export const isNoTrack = isBrowser && window.location.search.includes('notrack=true');

export const isTrack = isBrowser && isProdHostnames && !isNoTrack;

export const isProd = env.nodeEnv === 'production';

export const refreshMS = isProd ? 1000 * 5 : 1000 * 60;
