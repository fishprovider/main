import type { Order, OrderWithoutId } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';

import { ApiConfig, apiPost } from '~libs/api';
import storeOrders from '~stores/orders';

const orderAdd = async (
  payload: {
    order: OrderWithoutId;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Order>('/orders/add', payload, options);
  storeOrders.mergeDoc(doc);
  return doc;
};

export default orderAdd;
