import type { SourceType } from '@fishbot/utils/constants/pay';
import type { Transaction } from '@fishbot/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const depositGet = async (
  payload: {
    payId: string,
    srcType?: SourceType,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Transaction>('/deposit/get', payload, options);
  storeTransactions.mergeDoc(doc);
  return doc;
};

export default depositGet;
