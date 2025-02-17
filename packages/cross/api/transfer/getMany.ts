import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const transferGetMany = async (
  payload: {
    page?: number,
    pageSize?: number,
  },
  options?: ApiConfig,
) => {
  const docs = await apiPost<Transaction[]>('/transfer/getMany', payload, options);
  storeTransactions.mergeDocs(docs);
  return docs;
};

export default transferGetMany;
