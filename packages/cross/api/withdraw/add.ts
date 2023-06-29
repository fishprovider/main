import type { Transaction } from '@fishbot/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const withdrawAdd = async (
  payload: {
    amount: number,
    dstWalletId: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Transaction>('/withdraw/add', payload, options);
  storeTransactions.mergeDoc(doc);
  return doc;
};

export default withdrawAdd;
