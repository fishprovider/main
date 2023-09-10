import { Account } from '@fishprovider/core';

import { buildStoreSet } from '../store';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
