import type { Account, Lock } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';

const lockAccount = async (
  payload: {
    providerId: string;
    lock: Lock;
    unlock?: boolean;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/lock/account', payload, options);
  return doc;
};

export default lockAccount;
