import { Account } from '@fishprovider/core';

import { buildStoreSet } from '..';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
