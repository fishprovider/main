import type { Account } from '@fishprovider/core-new';

import { buildStoreSet } from '../store.framework';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
