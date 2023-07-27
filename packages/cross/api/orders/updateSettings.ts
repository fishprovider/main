import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeOrders from '~stores/orders';

const orderUpdateSettings = async (
  payload: {
    providerId: string,
    orderId: string,
    alarm?: boolean,
    reborn?: boolean,
    confidence?: number,
    lock?: boolean,
    hide?: boolean,
    chat?: string,
    chatType?: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Order>('/orders/updateSettings', payload, options);
  storeOrders.mergeDoc(doc);
  return doc;
};

export default orderUpdateSettings;
