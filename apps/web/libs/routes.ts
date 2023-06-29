const Routes = {
  home: '/',
  about: '/about',
  plans: '/plans',
  strategies: '/strategies',
  // strategy: '/strategies/:providerId',
  blog: '/blog',
  faq: '/faq',

  news: '/news',
  copyTrade: '/copy-trade',

  login: '/login',
  user: '/user',
  admin: '/admin',

  accountOpen: '/account-open',
  accounts: '/accounts',
  // account: '/accounts/:providerId',

  wallet: '/wallet',
  deposit: '/deposit',
  withdraw: '/withdraw',
  transfer: '/transfer',
  swap: '/swap',
  pay: '/pay',
  invest: '/invest',
  verify: '/verify',

  love: '/love',
  support: '/support',
  security: '/security',
  privacy: '/privacy',
  donate: '/donate',
  status: 'https://status.fishprovider.com',
};

const toStrategy = (providerId: string) => `${Routes.strategies}/${providerId}`;
const toAccount = (providerId: string) => `${Routes.accounts}/${providerId}`;

export default Routes;

export {
  toAccount,
  toStrategy,
};
