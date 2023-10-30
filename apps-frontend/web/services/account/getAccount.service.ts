import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountService = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(DataFetchAccountRepository.getAccount);
  const { doc: account } = await getAccountRepo(filter);

  if (account) {
    // TODO: migrate to DataFetchAccountRepository
    storeAccounts.mergeDoc(account as Partial<Account>);
  }

  return account;
};
