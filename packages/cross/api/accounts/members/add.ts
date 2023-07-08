import type { Roles } from '@fishprovider/utils/constants/user';
import type { Account } from '@fishprovider/utils/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const memberAdd = async (
  payload: {
    providerId: string;
    email: string;
    role: Roles,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/members/add', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default memberAdd;
