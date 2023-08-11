import type { Account } from '@fishprovider/enterprise';

import { buildStoreSet } from '../store.framework';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
