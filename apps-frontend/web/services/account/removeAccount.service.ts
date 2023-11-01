import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';

export const removeAccountService = async (filter: {
  accountId: string,
}) => {
  const getAccountRepo = checkRepository(DataFetchAccountRepository.removeAccount);
  await getAccountRepo(filter);

  // TODO: migrate to DataFetchAccountRepository
  storeAccounts.removeDoc(filter.accountId);
};
