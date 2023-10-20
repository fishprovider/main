import { getAccountsService } from '@fishprovider/base-services';
import { AccountViewType } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';
import { Account } from '@fishprovider/utils/dist/types/Account.model';

export const getAccountsController = async (filter: {
  accountViewType?: AccountViewType,
}) => {
  const { docs } = await getAccountsService({
    filter,
    repositories: {
      account: DataFetchAccountRepository,
    },
    context: {
      internal: true,
    },
  });

  if (docs) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDocs(docs as Partial<Account>[]);
  }

  return docs;
};
