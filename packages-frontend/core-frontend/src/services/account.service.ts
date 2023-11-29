import { checkRepository } from '@fishprovider/core';

import {
  AddAccountService, GetAccountService, GetAccountsService,
  RemoveAccountService, UpdateAccountService, WatchAccountService,
} from '..';

export const getAccountService: GetAccountService = async ({
  filter, repositories,
}) => {
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  return getAccountRepo(filter);
};

export const getAccountsService: GetAccountsService = async ({
  filter, repositories,
}) => {
  const getAccountsRepo = checkRepository(repositories.account.getAccounts);
  return getAccountsRepo(filter);
};

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, repositories,
}) => {
  const { account: accountUpdate, ...rest } = payload;

  if (accountUpdate) {
    const updateAccountRepo = checkRepository(repositories.clientOnly.updateAccount);
    return updateAccountRepo(filter, payload);
  }

  const updateAccountRepo = checkRepository(repositories.account.updateAccount);
  return updateAccountRepo(filter, rest);
};

export const addAccountService: AddAccountService = async ({
  payload, repositories,
}) => {
  const addAccountRepo = checkRepository(repositories.account.addAccount);
  return addAccountRepo(payload);
};

export const removeAccountService: RemoveAccountService = async ({
  filter, repositories,
}) => {
  const removeAccountRepo = checkRepository(repositories.account.removeAccount);
  return removeAccountRepo(filter);
};

export const watchAccountService: WatchAccountService = ({
  selector, repositories,
}) => {
  const watchAccountRepo = checkRepository(repositories.account.watchAccount);
  return watchAccountRepo(selector);
};
