import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';

const memberRemove = async (
  payload: {
    providerId: string;
    email: string;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/members/remove', payload, options);
  return doc;
};

export default memberRemove;
