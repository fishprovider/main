import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';

import { buildStoreSet } from '~libs/store';

const storeTransactions = buildStoreSet<Transaction>({}, 'transactions');

export default storeTransactions;
