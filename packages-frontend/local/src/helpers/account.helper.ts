import { AccountViewType } from '@fishprovider/core';

export const buildKeyAccount = (filter: {
  accountId?: string,
}) => `fp-account-${filter.accountId}`;

export const buildKeyAccounts = (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => {
  const keys = Object.entries(filter).map(([key, value]) => `${key}-${value}`);
  return `fp-accounts-${keys?.join('-')}`;
};
