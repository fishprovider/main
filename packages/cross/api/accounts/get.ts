import type { Account } from '@fishprovider/utils/types/Account.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountGet = async (
  payload: {
    providerId: string;
    reload?: boolean;
  },
  options?: ApiConfig,
) => {
  const doc = await apiGet<Account>('/accounts/get', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default accountGet;
