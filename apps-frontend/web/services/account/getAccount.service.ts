import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { LocalFirstAccountRepository } from '@fishprovider/local-first';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountService = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(LocalFirstAccountRepository.getAccount);
  const { doc: account } = await getAccountRepo(filter);

  if (account) {
    // TODO: migrate to LocalFirstAccountRepository
    storeAccounts.mergeDoc(account as Partial<Account>);
  }

  return account;
};
