import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { buildStoreSet } from '../store.framework';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
