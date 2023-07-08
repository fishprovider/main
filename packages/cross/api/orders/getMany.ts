import { OrderStatus } from '@fishprovider/utils/constants/order';
import type { Order } from '@fishprovider/utils/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import { ApiConfig, apiGet } from '~libs/api';
import storeOrders from '~stores/orders';

interface OrderGetManyRes {
  orders: Order[];
  positions: Order[];
}

const orderGetMany = async (
  payload: {
    providerId: string;
    reload?: boolean;
    orderStatus?: OrderStatus;
  },
  options?: ApiConfig,
) => {
  const res = await apiGet<OrderGetManyRes>('/orders/getMany', payload, options);

  const getNewDocs = () => {
    if (payload.orderStatus === OrderStatus.live) return res.positions;
    if (payload.orderStatus === OrderStatus.pending) return res.orders;
    return [...res.orders, ...res.positions];
  };
  const newDocs = getNewDocs();

  const newDocIds: Record<string, boolean> = {};
  newDocs.forEach((doc) => {
    newDocIds[doc._id] = true;
  });

  const docIdsToRemove: string[] = [];
  _.forEach(storeOrders.getState(), (doc) => {
    if (doc.providerId === payload.providerId
      && (payload.orderStatus
        ? payload.orderStatus === doc.status
        : [OrderStatus.live, OrderStatus.pending].includes(doc.status)
      )
      && !newDocIds[doc._id]
    ) {
      docIdsToRemove.push(doc._id);
    }
  });
  storeOrders.removeDocs(docIdsToRemove);

  const updatedDocs = newDocs.filter((item) => {
    const doc = storeOrders.getState()[item._id];
    if (!doc) return true;
    if (moment(doc.updatedAt).isSameOrBefore(moment(item.updatedAt))) return true;
    return false;
  });
  storeOrders.mergeDocs(updatedDocs);

  return res;
};

export default orderGetMany;
