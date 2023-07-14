import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { buildStoreSet } from '~libs/store';

const storeAccounts = buildStoreSet<Account>({}, 'accounts');

export default storeAccounts;
