import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { WalletType } from '@fishprovider/utils/constants/pay';

const queryKeys = {
  slimAccounts: () => ['slimAccounts'],
  infoAccounts: () => ['infoAccounts'],
  userAccounts: () => ['userAccounts'],

  account: (providerId?: string, field?: string) => ['account', providerId, field],
  orders: (providerId?: string) => ['orders', providerId],
  // ideas: (providerId?: string) => ['ideas', providerId],

  symbols: (providerType?: ProviderType) => ['symbols', providerType],
  detail: (providerType?: ProviderType, symbol?: string) => ['detail', providerType, symbol],
  prices: (providerType?: ProviderType, ...symbols: string[] | unknown[]) => ['prices', providerType, ...symbols],
  bars: (providerType?: ProviderType, symbol?: string, period?: string, scale?: number) => ['prices', providerType, symbol, period, scale],
  signals: (providerType?: ProviderType, symbol?: string) => ['signals', providerType, symbol],

  // dailyBalance: (providerId?: string, year?: number) => ['dailyBalance', providerId, year],
  // userThreads: () => ['threads'],

  wallets: (type: WalletType) => ['wallets', type],
  transactions: (type: string) => ['transactions', type],

  investRequests: () => ['investRequests'],
  transactionRequests: () => ['transactionRequests'],

  user: (userId?: string) => ['user', userId],

  clean: () => ['clean'],
};

export {
  queryKeys,
};
