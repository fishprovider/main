import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountAdd = async (
  payload: {
    accountToNew: Partial<Account>,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/add', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default accountAdd;
