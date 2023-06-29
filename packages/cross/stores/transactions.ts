import type { Transaction } from '@fishbot/utils/types/Pay.model';

import { buildStoreSet } from '~libs/store';

const storeTransactions = buildStoreSet<Transaction>({}, 'transactions');

export default storeTransactions;
