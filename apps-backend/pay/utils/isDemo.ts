import { AccountTradeType } from '@fishprovider/utils/dist/constants/account';

const env = {
  accountTradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
};

const isDemo = env.accountTradeType === AccountTradeType.demo;

export default isDemo;
