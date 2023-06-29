import type { Account } from '@fishbot/utils/types/Account.model';

import { buildStoreSet } from '~libs/store';

const storeAccounts = buildStoreSet<Account>({}, 'accounts');

export default storeAccounts;
