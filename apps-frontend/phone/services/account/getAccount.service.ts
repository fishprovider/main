import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { LocalFirstAccountRepository } from '@fishprovider/local-first';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountService = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(LocalFirstAccountRepository.getAccount);
  const { doc } = await getAccountRepo(filter);

  if (doc) {
    // TODO: migrate to LocalFirstAccountRepository
    storeAccounts.mergeDoc(doc as Partial<Account>);
  }

  return doc;
};
