import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeOrders from '~stores/orders';

const orderRemove = async (
  payload: {
    order: Order;
    options?: {
      volume?: number;
    },
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Order>('/orders/remove', payload, options);
  storeOrders.mergeDoc(doc);
  return doc;
};

export default orderRemove;
