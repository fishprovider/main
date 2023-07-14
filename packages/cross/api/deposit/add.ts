import type { SourceType } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const depositAdd = async (
  payload: {
    amount: number,
    srcType?: SourceType,
    srcCurrency?: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Transaction>('/deposit/add', payload, options);
  storeTransactions.mergeDoc(doc);
  return doc;
};

export default depositAdd;
