import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetResult } from '@fishprovider/core-frontend';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';

import { updateClientOnly } from '..';

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const updateLocal = LocalAccountRepository.updateAccount;
  const updateStore = StoreAccountRepository.updateAccount;

  const res = await updateClientOnly<BaseGetResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload)),
    updateStore: updateStore && (() => updateStore(filter, payload)),
  });

  return res ?? {};
};

export const ClientOnlyAccountRepository: AccountRepository = {
  ...StoreAccountRepository,
  ...LocalAccountRepository,
  updateAccount,
};
