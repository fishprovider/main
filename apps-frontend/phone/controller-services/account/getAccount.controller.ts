import { getAccountService } from '@fishprovider/base-services';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';

export const getAccountController = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const { doc } = await getAccountService({
    filter,
    repositories: {
      account: DataFetchAccountRepository,
    },
  });

  if (doc) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDoc(doc as any);
  }

  return doc;
};
