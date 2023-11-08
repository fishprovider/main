import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { LocalFirstAccountRepository } from '@fishprovider/local-first';

export const removeAccountService = async (filter: {
  accountId: string,
}) => {
  const removeAccountRepo = checkRepository(LocalFirstAccountRepository.removeAccount);
  await removeAccountRepo(filter);

  // TODO: migrate to LocalFirstAccountRepository
  storeAccounts.removeDoc(filter.accountId);
};
