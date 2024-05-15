import { Account } from '@fishprovider/core';
import { AccountRepository, RepositoryGetResult } from '@fishprovider/core-frontend';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';

import { updateClientOnly } from '..';

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  const updateLocal = LocalAccountRepository.updateAccount;
  const updateStore = StoreAccountRepository.updateAccount;

  const res = await updateClientOnly<RepositoryGetResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload, options)),
    updateStore: updateStore && (() => updateStore(filter, payload, options)),
  });

  return res ?? {};
};

export const ClientOnlyAccountRepository: AccountRepository = {
  ...StoreAccountRepository,
  // ...LocalAccountRepository,
  updateAccount,
};
