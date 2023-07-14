import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import { ApiConfig, apiGet } from '~libs/api';
import storeOrders from '~stores/orders';

const orderGetHistory = async (
  payload: {
    providerId: string;
    reload?: boolean;
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<Order[]>('/orders/getIdea', payload, options);
  storeOrders.mergeDocs(docs);
  return docs;
};

export default orderGetHistory;
