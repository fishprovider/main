import type { Account } from '@fishprovider/utils/types/Account.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountGetManyInfo = async (
  options?: ApiConfig,
) => {
  const docs = await apiGet<Account[]>('/accounts/getManyInfo', {}, options);
  storeAccounts.mergeDocs(docs);
  return docs;
};

export default accountGetManyInfo;
