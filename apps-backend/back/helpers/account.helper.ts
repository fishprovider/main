import {
  Account,
} from '@fishprovider/core';

export const sanitizeOutputAccount = (account?: Partial<Account>) => ({
  ...account,
  config: undefined,
});
