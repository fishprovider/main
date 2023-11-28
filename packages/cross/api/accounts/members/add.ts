import type { Roles } from '@fishprovider/utils/dist/constants/user';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';

const memberAdd = async (
  payload: {
    providerId: string;
    email: string;
    role: Roles,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/members/add', payload, options);
  return doc;
};

export default memberAdd;
