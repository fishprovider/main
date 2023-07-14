import { ActionType, EntryType } from '@fishprovider/metatrader/dist/constants/metaApi';
import { ProviderPlatform, type ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';
import _ from 'lodash';

// const buildSymbol = (symbol: string) => (isStandard ? `${symbol}m` : symbol);
const buildSymbol = (symbol: string) => symbol;

const transformSymbol = (symbol: string) => _.trimEnd(symbol, 'm');

const transformOrderType = (orderType: string) => {
  switch (orderType) {
    case ActionType.ORDER_TYPE_BUY_LIMIT:
      return { orderType: OrderType.limit, direction: Direction.buy };
    case ActionType.ORDER_TYPE_SELL_LIMIT:
      return { orderType: OrderType.limit, direction: Direction.sell };
    case ActionType.ORDER_TYPE_BUY_STOP:
      return { orderType: OrderType.stop, direction: Direction.buy };
    case ActionType.ORDER_TYPE_SELL_STOP:
      return { orderType: OrderType.stop, direction: Direction.sell };
    case ActionType.ORDER_TYPE_BUY:
    case ActionType.POSITION_TYPE_BUY:
    case ActionType.DEAL_TYPE_BUY:
      return { orderType: OrderType.market, direction: Direction.buy };
    case ActionType.ORDER_TYPE_SELL:
    case ActionType.POSITION_TYPE_SELL:
    case ActionType.DEAL_TYPE_SELL:
      return { orderType: OrderType.market, direction: Direction.sell };
    default:
      return {};
  }
};

const transformPosition = (
  position: any,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { orderType, direction } = position.type ? transformOrderType(position.type) : position;
  const lot = position.volume; // volume in metatrader response is lot
  const volume = getVolumeFromLot({
    providerType,
    symbol: transformSymbol(position.symbol),
    lot,
    prices: symbolIds,
  }).volume || 0;
  return {
    positionId: position.id,

    providerId,
    providerType,
    providerPlatform: ProviderPlatform.metatrader,
    orderType,
    status: OrderStatus.live,

    symbol: transformSymbol(position.symbol),
    symbolId: transformSymbol(position.symbol),
    direction,
    volume,
    lot,

    price: position.openPrice,
    stopLoss: position.stopLoss,
    takeProfit: position.takeProfit,

    commission: position.commission,
    swap: position.swap,
    comment: position.comment,

    providerData: position,

    updatedAt: position.time,
    createdAt: position.time,
  };
};

const transformOrder = (
  order: any,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { orderType, direction } = order.type ? transformOrderType(order.type) : order;
  const lot = order.volume; // volume in metatrader response is lot
  const volume = getVolumeFromLot({
    providerType,
    symbol: transformSymbol(order.symbol),
    lot,
    prices: symbolIds,
  }).volume || 0;
  return {
    orderId: order.id,
    positionId: order.positionId || order.id,

    providerId,
    providerType,
    providerPlatform: ProviderPlatform.metatrader,
    orderType,
    status: OrderStatus.pending,

    symbol: transformSymbol(order.symbol),
    symbolId: transformSymbol(order.symbol),
    direction,
    volume,
    lot,

    limitPrice: order.openPrice,
    stopPrice: order.openPrice,
    stopLoss: order.stopLoss,
    takeProfit: order.takeProfit,

    comment: order.comment,

    providerData: order,

    updatedAt: order.time,
    createdAt: order.time,
  };
};

const transformDeal = (
  deal: any,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { orderType, direction: directionRaw } = deal.type ? transformOrderType(deal.type) : deal;
  const lot = deal.volume; // volume in metatrader response is lot
  const volume = getVolumeFromLot({
    providerType,
    symbol: transformSymbol(deal.symbol),
    lot,
    prices: symbolIds,
  }).volume || 0;
  const {
    direction, price, priceClose, volumeClose,
  } = deal.entryType === EntryType.DEAL_ENTRY_OUT ? {
    direction: directionRaw === Direction.buy ? Direction.sell : Direction.buy,
    price: undefined,
    priceClose: deal.price,
    volumeClose: deal.volume,
  } : {
    direction: directionRaw,
    price: deal.price,
    priceClose: undefined,
    volumeClose: undefined,
  };
  return {
    dealId: deal.id,
    orderId: deal.orderId || deal.id,
    positionId: deal.positionId || deal.id,

    providerId,
    providerType,
    providerPlatform: ProviderPlatform.metatrader,
    orderType,
    // status can be live or closed

    symbol: transformSymbol(deal.symbol),
    symbolId: transformSymbol(deal.symbol),
    direction,
    volume,
    lot,

    ...(price && { price }),
    ...(priceClose && { priceClose }),
    ...(volumeClose && { volumeClose }),

    commission: deal.commission,
    swap: deal.swap,

    grossProfit: deal.unrealizedProfit || deal.profit,
    profit: deal.profit,

    providerData: deal,

    updatedAt: deal.time,
    createdAt: deal.time,
  };
};

export {
  buildSymbol,
  transformDeal,
  transformOrder,
  transformPosition,
};
