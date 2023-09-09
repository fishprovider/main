import {
  Account,
  type AccountRepository,
  type GetAccountFilter,
} from '@fishprovider/core-new';

import { fishApi } from '../main';

const getAccount = async (filter: GetAccountFilter) => {
  const { apiGet } = await fishApi.get();
  const account = await apiGet<Partial<Account> | undefined>('/account/getAccount', filter);
  return { doc: account };
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
};
