import type { Account } from '@fishprovider/models';

import { buildStoreSet } from '../store.framework';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
