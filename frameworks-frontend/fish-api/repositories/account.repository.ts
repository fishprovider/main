import { type GetAccountRepositoryParams } from '@fishprovider/application';
import type { Account } from '@fishprovider/core-new';

// import { StoreAccountRepository } from '@fishprovider/framework-store';
import { fishApi } from '../fishApi.framework';

export const getAccount = async (params: GetAccountRepositoryParams) => {
  const { apiGet } = await fishApi.get();
  const account = await apiGet<Account>('/account/getAccount', params);
  // StoreAccountRepository.setAccount({ account });
  return account;
};
