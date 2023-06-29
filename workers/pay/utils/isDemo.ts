import { ProviderTradeType } from '@fishbot/utils/constants/account';

const env = {
  providerTradeType: process.env.PROVIDER_TRADE_TYPE || ProviderTradeType.demo,
};

const isDemo = env.providerTradeType === ProviderTradeType.demo;

export default isDemo;
