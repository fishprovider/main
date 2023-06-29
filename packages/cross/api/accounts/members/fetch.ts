import type { Account } from '@fishbot/utils/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const memberFetch = async (
  payload: {
    providerId: string
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/members/fetch', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default memberFetch;
