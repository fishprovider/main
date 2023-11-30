import { checkRepository } from '@fishprovider/core';

import {
  AddAccountService, GetAccountService, GetAccountsService,
  RemoveAccountService, UpdateAccountService, WatchAccountService,
} from '..';

export const getAccountService: GetAccountService = async ({
  filter, repositories, options,
}) => {
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  return getAccountRepo(filter, options);
};

export const getAccountsService: GetAccountsService = async ({
  filter, repositories, options,
}) => {
  const getAccountsRepo = checkRepository(repositories.account.getAccounts);
  return getAccountsRepo(filter, options);
};

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, repositories, options,
}) => {
  const { account: accountUpdate, ...rest } = payload;

  if (accountUpdate) {
    const updateAccountRepo = checkRepository(repositories.clientOnly.updateAccount);
    return updateAccountRepo(filter, payload, options);
  }

  const updateAccountRepo = checkRepository(repositories.account.updateAccount);
  return updateAccountRepo(filter, rest, options);
};

export const addAccountService: AddAccountService = async ({
  payload, repositories, options,
}) => {
  const addAccountRepo = checkRepository(repositories.account.addAccount);
  return addAccountRepo(payload, options);
};

export const removeAccountService: RemoveAccountService = async ({
  filter, repositories, options,
}) => {
  const removeAccountRepo = checkRepository(repositories.account.removeAccount);
  return removeAccountRepo(filter, options);
};

export const watchAccountService: WatchAccountService = ({
  selector, repositories,
}) => {
  const watchAccountRepo = checkRepository(repositories.account.watchAccount);
  return watchAccountRepo(selector);
};
