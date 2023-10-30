import { AccountViewType, checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountsService = async (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => {
  const getAccountsRepo = checkRepository(DataFetchAccountRepository.getAccounts);
  const { docs: accounts } = await getAccountsRepo(filter);

  if (accounts) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDocs(accounts as Partial<Account>[]);
  }

  return accounts;
};
