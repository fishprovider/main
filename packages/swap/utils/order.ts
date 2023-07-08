import { redisKeys } from '@fishprovider/utils/constants/redis';
import type { Order } from '@fishprovider/utils/types/Order.model';

const getPendingOrders = async (providerId: string) => {
  const str = await Redis.get(redisKeys.pendingOrders(providerId));
  return str ? JSON.parse(str) as Order[] : [];
};

const getLiveOrders = async (providerId: string) => {
  const str = await Redis.get(redisKeys.liveOrders(providerId));
  return str ? JSON.parse(str) as Order[] : [];
};

const getOrders = async (providerId: string) => {
  const orders = await getPendingOrders(providerId);
  const positions = await getLiveOrders(providerId);
  return { orders, positions };
};

const getDealsKey = (
  providerId: string,
  options: { weeks?: number, days?: number, from?: number, to?: number },
) => {
  const {
    weeks, days, from, to,
  } = options;
  const keyBase = redisKeys.historyOrders(providerId);
  if (from && to) {
    return `${keyBase}-fromto-${from}-${to}`;
  }
  if (days) {
    return `${keyBase}-days-${days}`;
  }
  if (weeks) {
    return `${keyBase}-weeks-${weeks}`;
  }
  return keyBase;
};

const getDeals = async (
  providerId: string,
  options: { weeks?: number, days?: number, from?: number, to?: number },
) => {
  const key = getDealsKey(providerId, options);
  const str = await Redis.get(key);
  return str ? JSON.parse(str) as Order[] : [];
};

export {
  getDeals,
  getDealsKey,
  getLiveOrders,
  getOrders,
  getPendingOrders,
};
