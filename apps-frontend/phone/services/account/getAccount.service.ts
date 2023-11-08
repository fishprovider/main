import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountService = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(StoreFirstAccountRepository.getAccount);
  const { doc } = await getAccountRepo(filter);

  if (doc) {
    // TODO: migrate to StoreFirstAccountRepository
    storeAccounts.mergeDoc(doc as Partial<Account>);
  }

  return doc;
};
