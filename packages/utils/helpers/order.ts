import { KeySeparator } from '~constants/copier';
import { OrderType } from '~constants/order';
import type { Order, OrderWithoutId } from '~types/Order.model';
import type { Price } from '~types/Price.model';

import { getConversionRate, getGrossProfit } from './price';

const buildCopyId = (providerId: string, order: Order) => `${providerId}${KeySeparator}${order.providerId}${KeySeparator}${order._id}`;

const parseCopyId = (copyId: string) => {
  const [providerId, parentId, parentOrderId] = copyId.split(KeySeparator);
  return { providerId, parentId, parentOrderId };
};

const getProfit = (
  orders: Order[],
  prices: Record<string, Price>,
  asset: string,
) => {
  let totalProfit = 0;
  orders.forEach((order) => {
    const {
      providerType, symbol, direction, volume, price,
      profit = 0,
      grossProfit = 0,
      commission = 0,
      commissionClose = commission,
      swap = 0,
    } = order;

    if (profit) {
      totalProfit += profit;
      return;
    }

    const getGross = () => {
      if (grossProfit) return grossProfit;

      const priceDoc = prices[`${providerType}-${symbol}`];
      const { conversionRate } = getConversionRate(providerType, symbol, asset, prices);
      if (price && priceDoc && conversionRate) {
        return getGrossProfit({
          direction,
          volume,
          entry: price,
          price: priceDoc,
          rate: conversionRate,
        });
      }
      return 0;
    };

    totalProfit += getGross() + commission + commissionClose + swap;
  });
  return totalProfit;
};

const getEntry = (order: OrderWithoutId) => {
  switch (order.orderType) {
    case OrderType.limit: return order.limitPrice;
    case OrderType.stop: return order.stopPrice;
    default: return order.price;
  }
};

const getProfitIcon = (profitRatio: number, slimMode = false) => {
  if (!profitRatio) return '';
  if (profitRatio > 14) return '🧘';
  if (profitRatio > 13) return '🏰';
  if (profitRatio > 12) return '🏠';
  if (profitRatio > 11) return '🛸';
  if (profitRatio > 10) return '✈️';
  if (profitRatio > 9) return '🛥️';
  if (profitRatio > 8) return '🚗';
  if (profitRatio > 7) return '💎';
  if (profitRatio > 6) return '🏖';
  if (profitRatio > 5) return '🍼';
  if (profitRatio > 4) return '🍚';
  if (profitRatio > 3) return '🌽';
  if (profitRatio > 2) return '🍜';
  if (profitRatio > 1) return '🍞';
  if (profitRatio > 0) return '☕';
  if (profitRatio > -1) return '💩';
  if (profitRatio > -2) return slimMode ? '💔' : '💩💔';
  if (profitRatio > -3) return slimMode ? '🔥' : '💩💔🔥';
  if (profitRatio > -4) return slimMode ? '💀' : '💩💔🔥💀';
  if (profitRatio > -5) return slimMode ? '☠️' : '💩💔🔥💀☠️';
  if (profitRatio > -6) return slimMode ? '⚰️' : '💩💔🔥💀☠️⚰️';
  if (profitRatio > -7) return slimMode ? '👻' : '💩💔🔥💀☠️⚰️👻';
  if (profitRatio > -8) return slimMode ? '🧛' : '💩💔🔥💀☠️⚰️👻🧛';
  return slimMode ? '👼' : '💩💔🔥💀☠️⚰️👻🧛👼';
};

export {
  buildCopyId,
  getEntry,
  getProfit,
  getProfitIcon,
  parseCopyId,
};
