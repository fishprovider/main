import type { ProviderTradeType } from '@fishbot/utils/constants/account';

const env = {
  typePre: process.env.TYPE_PRE,
};

const EventNames = {
  headStart: (providerTradeType: ProviderTradeType) => `${env.typePre}-${providerTradeType}-head-start-provider`,
  headDestroy: (providerTradeType: ProviderTradeType) => `${env.typePre}-${providerTradeType}-head-destroy-provider`,
  headMetaStart: (providerTradeType: ProviderTradeType) => `${env.typePre}-${providerTradeType}-head-meta-start-provider`,
  headMetaDestroy: (providerTradeType: ProviderTradeType) => `${env.typePre}-${providerTradeType}-head-meta-destroy-provider`,
};

export {
  EventNames,
};
