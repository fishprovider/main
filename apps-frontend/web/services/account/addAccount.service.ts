import {
  AccountConfig, AccountPlatform, AccountTradeType, AccountType, checkRepository,
} from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';
import { Account } from '@fishprovider/utils/types/Account.model';

export const addAccountService = async (
  payload: {
    name: string,
    accountType: AccountType,
    accountPlatform: AccountPlatform,
    accountTradeType: AccountTradeType,
    baseConfig: Partial<AccountConfig>,
  },
) => {
  const addAccountRepo = checkRepository(StoreFirstAccountRepository.addAccount);
  const { doc: account } = await addAccountRepo(payload);

  if (account) {
    // TODO: migrate to StoreFirstAccountRepository
    storeAccounts.mergeDoc(account as Partial<Account>);
  }

  return account;
};
