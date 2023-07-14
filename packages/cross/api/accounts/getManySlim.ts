import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountGetManySlim = async (
  options?: ApiConfig,
) => {
  const docs = await apiGet<Account[]>('/accounts/getManySlim', {}, options);
  storeAccounts.mergeDocs(docs);
  return docs;
};

export default accountGetManySlim;
