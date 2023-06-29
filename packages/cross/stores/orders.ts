import type { Order } from '@fishbot/utils/types/Order.model';

import { buildStoreSet } from '~libs/store';

const storeOrders = buildStoreSet<Order>({}, 'orders');

export default storeOrders;
