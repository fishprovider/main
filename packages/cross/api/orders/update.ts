import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeOrders from '~stores/orders';

const orderUpdate = async (
  payload: {
    order: Order;
    options?: {
      stopLoss?: number;
      lockSL?: number;
      lockSLAmt?: number;
      takeProfit?: number;
      limitPrice?: number;
      stopPrice?: number;
      volume?: number;
    },
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Order>('/orders/update', payload, options);
  storeOrders.mergeDoc(doc);
  return doc;
};

export default orderUpdate;
