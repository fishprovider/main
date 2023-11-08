import { AccountViewType, checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountsService = async (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => {
  const getAccountsRepo = checkRepository(StoreFirstAccountRepository.getAccounts);
  const { docs: accounts } = await getAccountsRepo(filter);

  if (accounts) {
    // TODO: migrate to StoreFirstAccountRepository
    storeAccounts.mergeDocs(accounts as Partial<Account>[]);
  }

  return accounts;
};
