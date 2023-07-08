import type { Transaction } from '@fishprovider/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const transferAdd = async (
  payload: {
    amount: number,
    email: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Transaction>('/transfer/add', payload, options);
  storeTransactions.mergeDoc(doc);
  return doc;
};

export default transferAdd;
