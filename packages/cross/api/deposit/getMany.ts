import type { Transaction } from '@fishbot/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const depositGetMany = async (
  payload: {
    page?: number,
    pageSize?: number,
  },
  options?: ApiConfig,
) => {
  const docs = await apiPost<Transaction[]>('/deposit/getMany', payload, options);
  storeTransactions.mergeDocs(docs);
  return docs;
};

export default depositGetMany;
