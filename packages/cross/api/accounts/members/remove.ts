import type { Account } from '@fishbot/utils/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const memberRemove = async (
  payload: {
    providerId: string;
    email: string;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/members/remove', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default memberRemove;
