import { getAccountsService } from '@fishprovider/base-services';
import { AccountViewType } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';

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
    storeAccounts.mergeDocs(docs as any);
  }

  return docs;
};
