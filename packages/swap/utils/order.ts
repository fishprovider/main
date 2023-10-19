import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';

const getPendingOrders = async (providerId: string) => {
  const str = await Redis.get(redisKeys.pendingOrders(providerId));
  return str ? JSON.parse(str) as Order[] : [];
};

const getLiveOrders = async (providerId: string, getAll?: boolean) => {
  const str = await Redis.get(redisKeys.liveOrders(providerId));
  const rawLiveOrders = str ? JSON.parse(str) as Order[] : [];

  if (getAll) return rawLiveOrders;

  // hack: filter out hack LTCUSD orders to keep CTrader Strategy active
  const liveOrders = rawLiveOrders.filter((item) => item.symbol !== 'LTCUSD');

  return liveOrders;
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
