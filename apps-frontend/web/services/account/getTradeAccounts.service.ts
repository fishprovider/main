import {
  AccountConfig, AccountPlatform, checkRepository,
} from '@fishprovider/core';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';

export const getTradeAccountsService = async (filter: {
  accountPlatform: AccountPlatform,
  baseConfig: Partial<AccountConfig>,
  tradeRequest: {
    redirectUrl: string,
    code: string,
  },
}) => {
  const getTradeAccountsRepo = checkRepository(StoreFirstAccountRepository.getAccounts);
  const { docs: tradeAccounts } = await getTradeAccountsRepo({
    getTradeAccounts: filter,
  });

  return tradeAccounts;
};
