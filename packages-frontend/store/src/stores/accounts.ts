import { Account } from '@fishprovider/core';

import { buildStoreSet } from '../main';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
