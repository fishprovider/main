import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import { buildStoreSet } from '~libs/store';

const storeOrders = buildStoreSet<Order>({}, 'orders');

export default storeOrders;
