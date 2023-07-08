import type { Account } from '@fishprovider/utils/types/Account.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountGetManyUser = async (
  options?: ApiConfig,
) => {
  const docs = await apiGet<Account[]>('/accounts/getManyUser', {}, options);
  storeAccounts.mergeDocs(docs);
  return docs;
};

export default accountGetManyUser;
