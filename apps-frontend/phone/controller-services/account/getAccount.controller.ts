import { getAccountService } from '@fishprovider/base-services';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';
import { Account } from '@fishprovider/utils/dist/types/Account.model';

export const getAccountController = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const { doc } = await getAccountService({
    filter,
    repositories: {
      account: DataFetchAccountRepository,
    },
    context: {
      internal: true,
    },
  });

  if (doc) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDoc(doc as Partial<Account>);
  }

  return doc;
};
