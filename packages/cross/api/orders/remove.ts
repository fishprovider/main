import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';

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
