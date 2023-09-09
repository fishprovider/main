import { Account } from '@fishprovider-new/core';

import { buildStoreSet } from '../main';

export const storeAccounts = buildStoreSet<Account>({}, 'accounts');
