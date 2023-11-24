import type { AccountTradeType } from '@fishprovider/utils/dist/constants/account';

const env = {
  typePre: process.env.TYPE_PRE,
};

const EventNames = {
  headStart: (tradeType: AccountTradeType) => `${env.typePre}-${tradeType}-head-start-provider`,
  headDestroy: (tradeType: AccountTradeType) => `${env.typePre}-${tradeType}-head-destroy-provider`,
  headMetaStart: (tradeType: AccountTradeType) => `${env.typePre}-${tradeType}-head-meta-start-provider`,
  headMetaDestroy: (tradeType: AccountTradeType) => `${env.typePre}-${tradeType}-head-meta-destroy-provider`,
};

export {
  EventNames,
};
