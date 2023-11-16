import type { AccountTradeType } from '@fishprovider/utils/dist/constants/account';

const env = {
  typePre: process.env.TYPE_PRE,
};

const EventNames = {
  headStart: (accountTradeType: AccountTradeType) => `${env.typePre}-${accountTradeType}-head-start-provider`,
  headDestroy: (accountTradeType: AccountTradeType) => `${env.typePre}-${accountTradeType}-head-destroy-provider`,
  headMetaStart: (accountTradeType: AccountTradeType) => `${env.typePre}-${accountTradeType}-head-meta-start-provider`,
  headMetaDestroy: (accountTradeType: AccountTradeType) => `${env.typePre}-${accountTradeType}-head-meta-destroy-provider`,
};

export {
  EventNames,
};
