import { AccountViewType } from '@fishprovider/core';

export const buildKeyAccounts = (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => {
  const keys = Object.entries(filter).map(([key, value]) => `${key}-${value}`);
  return `news-${keys?.join('-')}`;
};
