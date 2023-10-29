import { checkRepository } from '@fishprovider/core-frontend';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountService = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(DataFetchAccountRepository.getAccount);
  const { doc } = await getAccountRepo(filter);

  if (doc) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDoc(doc as Partial<Account>);
  }

  return doc;
};
