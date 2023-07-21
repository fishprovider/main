import type { Account } from '@fishprovider/enterprise-rules';

import { buildStoreSet } from '../store.framework';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
