import type { Account } from '@fishprovider/core-new';

import { buildStoreSet } from '../main';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
