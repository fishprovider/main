import { AccountTradeType } from '@fishprovider/utils/dist/constants/account';

const env = {
  tradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
};

const isDemo = env.tradeType === AccountTradeType.demo;

export default isDemo;
