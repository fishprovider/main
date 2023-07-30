import { push } from '@fishprovider/core/dist/libs/notif';
import random from '@fishprovider/utils/dist/helpers/random';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import { botUser } from './account';

type OrderSlim = Omit<Order, 'updatedLogs' | 'providerData'>;

const newRequestOrder = async (
  order: OrderWithoutId,
  providerData?: any,
): Promise<Order> => {
  const {
    providerId,
    label = 'system-create',
    orderId, positionId,
  } = order;
  const newId = positionId || orderId || random();
  const {
    comment = `system-create-${newId}`,
  } = order;
  const doc = {
    ...order,
    _id: `${providerId}-${newId}`,
    comment,
    label,
    providerData: _.omit(providerData, ['symbolIds', 'prices']),
    updatedAt: new Date(),
    createdAt: new Date(),
    ...botUser,
  };
  Logger.warn(`Creating requestOrder ${doc._id}`);
  await Mongo.collection<Order>('orders').insertOne({
    ...doc,
    updatedLogs: [doc],
  });

  const price = order.price || order.limitPrice || order.stopPrice;
  const msg = `[${positionId}] ${order.direction} ${order.volume} ${order.symbol} at ${price} SL ${order.stopLoss} TP ${order.takeProfit} by ${botUser.userName}`;
  push(
    { title: `[${providerId}] New order`, body: msg },
    `account-${providerId}`,
  );

  return doc;
};

// called by update/remove order/position
const preCommandOrder = async (order: Order): Promise<Order> => {
  const newId = random();
  const {
    providerId,
    orderId = `system-${newId}`,
    positionId = `system-${newId}`,
    comment = `system-create-${newId}`,
    label = 'system-create',
  } = order;

  const requestOrder = await Mongo.collection<OrderSlim>('orders').findOne({
    providerId,
    $or: [
      { orderId },
      { positionId },
      { comment },
    ],
  }, {
    projection: {
      updatedLogs: 0,
      providerData: 0,
    },
  });
  if (requestOrder) {
    return {
      ...requestOrder,
      ...order,
      orderId,
      positionId,
      comment,
      label,
    };
  }

  Logger.warn('[preCommandOrder] requestOrder not found', orderId, positionId);
  const doc = await newRequestOrder(
    {
      ...order,
      orderId,
      positionId,
      comment,
      label,
      sourceType: 'system',
      tag: 'preCommandOrder',
    },
  );
  return doc;
};

const findRequestOrders = async (
  providerId: string,
  orders: OrderWithoutId[],
): Promise<Record<string, Order>> => {
  const orderIds: string[] = [];
  const positionIds: string[] = [];
  const comments: string[] = [];
  orders.forEach(({ orderId, positionId, comment }) => {
    if (orderId) orderIds.push(orderId);
    if (positionId) positionIds.push(positionId);
    if (comment) comments.push(comment);
  });

  const orFilters = [];
  if (orderIds.length) orFilters.push({ orderId: { $in: orderIds } });
  if (positionIds.length) orFilters.push({ positionId: { $in: positionIds } });
  if (comments.length) orFilters.push({ comment: { $in: comments } });

  if (!orFilters.length) return {};

  const requestOrders = await Mongo.collection<OrderSlim>('orders').find({
    providerId,
    $or: orFilters,
  }, {
    projection: {
      updatedLogs: 0,
      providerData: 0,
    },
  }).toArray();

  return _.keyBy(requestOrders, '_id');
};

const findRequestOrder = async (
  order: OrderWithoutId,
  requestOrders: Record<string, Order>,
): Promise<Order> => {
  const { orderId, positionId, comment } = order;
  let requestOrder = _.find(
    requestOrders,
    (req) => (!!req.orderId && req.orderId === orderId)
      || (!!req.positionId && req.positionId === positionId)
      || (!!req.comment && req.comment === comment),
  );
  if (!requestOrder) {
    requestOrder = await newRequestOrder(order);
  }
  return {
    ...requestOrder,
    ...order,
    ...(orderId && { orderId }),
    positionId,
    comment,
  };
};

export {
  findRequestOrder,
  findRequestOrders,
  newRequestOrder,
  preCommandOrder,
};
