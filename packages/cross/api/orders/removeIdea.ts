import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';

import { ApiConfig, apiPost } from '~libs/api';
import storeOrders from '~stores/orders';

const orderRemoveIdea = async (
  payload: {
    order: Order;
  },
  options?: ApiConfig,
) => {
  await apiPost('/orders/removeIdea', payload, options);
  storeOrders.removeDoc(payload.order._id);
};

export default orderRemoveIdea;
