import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const transferGet = async (
  payload: {
    payId: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Transaction>('/transfer/get', payload, options);
  storeTransactions.mergeDoc(doc);
  return doc;
};

export default transferGet;
