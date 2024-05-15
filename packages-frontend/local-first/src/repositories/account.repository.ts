import { Account } from '@fishprovider/core';
import { AccountRepository, RepositoryGetManyResult, RepositoryGetResult } from '@fishprovider/core-frontend';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { LocalAccountRepository } from '@fishprovider/local';

import { getLocalFirst, updateLocalFirst } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getLocal = LocalAccountRepository.getAccount;
  const setLocal = LocalAccountRepository.updateAccount;
  const getApi = FishApiAccountRepository.getAccount;

  const res = await getLocalFirst<RepositoryGetResult<Account>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ doc } = {}) => setLocal(filter, { account: doc }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getLocal = LocalAccountRepository.getAccounts;
  const setLocal = LocalAccountRepository.updateAccounts;
  const getApi = FishApiAccountRepository.getAccounts;

  const res = await getLocalFirst<RepositoryGetManyResult<Account>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ docs } = {}) => setLocal(filter, { accounts: docs }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  const updateApi = FishApiAccountRepository.updateAccount;
  const updateLocal = LocalAccountRepository.updateAccount;

  const res = await updateLocalFirst<RepositoryGetResult<Account>>({
    updateApi: updateApi && (() => updateApi(filter, payload, options)),
    updateLocal: updateLocal && (() => updateLocal(filter, payload, options)),
  });

  return res ?? {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload, options) => {
  const updateApi = FishApiAccountRepository.updateAccounts;
  const updateLocal = LocalAccountRepository.updateAccounts;

  const res = await updateLocalFirst<RepositoryGetManyResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload, options)),
    updateApi: updateApi && (() => updateApi(filter, payload, options)),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter, options) => {
  const updateApi = FishApiAccountRepository.removeAccount;
  const updateLocal = LocalAccountRepository.removeAccount;

  const res = await updateLocalFirst<RepositoryGetResult<Account>>({
    updateApi: updateApi && (() => updateApi(filter, options)),
    updateLocal: updateLocal && (() => updateLocal(filter, options)),
  });

  return res ?? {};
};

export const LocalFirstAccountRepository: AccountRepository = {
  // ...LocalAccountRepository,
  ...FishApiAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
