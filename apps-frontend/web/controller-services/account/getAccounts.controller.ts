import { getAccountsService } from '@fishprovider/base-services';
import { AccountViewType } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountsController = async (filter: {
  accountViewType?: AccountViewType,
}) => {
  const { docs: accounts } = await getAccountsService({
    filter,
    repositories: {
      account: DataFetchAccountRepository,
    },
    context: {
      internal: true,
    },
  });

  if (accounts) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDocs(accounts as Partial<Account>[]);
  }

  return accounts;
};
