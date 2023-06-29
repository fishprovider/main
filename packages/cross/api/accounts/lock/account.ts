import type { Account, Lock } from '@fishbot/utils/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const lockAccount = async (
  payload: {
    providerId: string;
    lock: Lock;
    unlock?: boolean;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/lock/account', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default lockAccount;
