import type { Transaction } from '@fishprovider/utils/types/Pay.model';

import { buildStoreSet } from '~libs/store';

const storeTransactions = buildStoreSet<Transaction>({}, 'transactions');

export default storeTransactions;
