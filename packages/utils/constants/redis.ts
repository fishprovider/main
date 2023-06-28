import type { ProviderType } from './account';

const redisKeys = {
  assets: (providerType: ProviderType) => `assets-${providerType}`,
  symbols: (providerType: ProviderType) => `symbols-${providerType}`,
  price: (providerType: ProviderType, symbol: string) => `price-${providerType}-${symbol}`,
  accounts: (page?: number) => `accounts-${page}`,
  account: (providerId: string) => `account-${providerId}`,
  liveOrders: (providerId: string) => `liveOrders-${providerId}`,
  pendingOrders: (providerId: string) => `pendingOrders-${providerId}`,
  historyOrders: (providerId: string) => `historyOrders-${providerId}`,
};

export {
  redisKeys,
};
