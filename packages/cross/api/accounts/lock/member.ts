import type { Account, Lock } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';

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
  return doc;
};

export default lockMember;
