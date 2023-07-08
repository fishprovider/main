import type { Transaction } from '@fishprovider/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeTransactions from '~stores/transactions';

const withdrawGetMany = async (
  payload: {
    page?: number,
    pageSize?: number,
  },
  options?: ApiConfig,
) => {
  const docs = await apiPost<Transaction[]>('/withdraw/getMany', payload, options);
  storeTransactions.mergeDocs(docs);
  return docs;
};

export default withdrawGetMany;
