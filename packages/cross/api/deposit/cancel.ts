import type { SourceType } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const depositCancel = async (
  payload: {
    payId: string,
    srcType?: SourceType,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Transaction>('/deposit/cancel', payload, options);
  storeTransactions.mergeDoc(doc);
  return doc;
};

export default depositCancel;
