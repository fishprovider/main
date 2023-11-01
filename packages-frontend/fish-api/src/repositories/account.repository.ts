import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';

import { fishApiGet } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { accountId, getTradeInfo } = filter;

  if (getTradeInfo) {
    const account = await fishApiGet<Partial<Account> | undefined>('/account/getTradeAccount', {
      accountId,
    });
    return { doc: account };
  }

  const account = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', {
    accountId,
  });
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const { accountViewType, email } = filter;
  const accounts = await fishApiGet<Partial<Account>[] | undefined>('/account/getAccounts', {
    accountViewType, email,
  });
  return { docs: accounts };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const { accountId } = filter;
  await fishApiGet<Partial<Account> | undefined>('/account/removeAccount', {
    accountId,
  });
  return {};
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  removeAccount,
};
