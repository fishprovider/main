const Routes = {
  home: '/',
  about: '/about',
  plans: '/plans',
  strategies: '/strategies',
  // strategy: '/strategies/:providerId',
  reports: '/reports',
  faq: '/faq',
  blog: '/blog',
  news: '/news',

  copyTrade: '/copy-trade',

  login: '/login',
  user: '/user',
  admin: '/admin',

  accountOpen: '/account-open',
  accounts: '/accounts',
  // account: '/accounts/:providerId',

  wallets: '/wallets',
  // wallet: '/wallets/:walletId',
  deposit: '/deposit',
  withdraw: '/withdraw',
  transfer: '/transfer',
  swap: '/swap',
  pay: '/pay',
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
const toWallet = (walletId: string) => `${Routes.wallets}/${walletId}`;

export default Routes;

export {
  toAccount,
  toStrategy,
  toWallet,
};
