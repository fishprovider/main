import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import { ApiConfig, apiGet } from '~libs/api';
import storeOrders from '~stores/orders';

const orderGetManyInfo = async (
  payload: {
    providerId: string;
    orderIds: string[],
    fields?: string[],
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<Order[]>('/orders/getManyInfo', payload, options);
  storeOrders.mergeDocs(docs);
  return docs;
};

export default orderGetManyInfo;
