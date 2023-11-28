import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';

const memberFetch = async (
  payload: {
    providerId: string
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/members/fetch', payload, options);
  return doc;
};

export default memberFetch;
