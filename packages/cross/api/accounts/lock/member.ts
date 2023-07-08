import type { Account, Lock } from '@fishprovider/utils/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const lockMember = async (
  payload: {
    providerId: string;
    userId: string;
    lock: Lock;
    unlock?: boolean;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/lock/member', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default lockMember;
