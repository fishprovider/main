import { OrderType as OrderTypeCTrader, TradeSide } from '@fishprovider/ctrader/constants/openApi';
import { ProviderPlatform, type ProviderType } from '@fishprovider/utils/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/constants/order';
import { getLotFromVolume } from '@fishprovider/utils/helpers/price';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';

const transformOrderType = (orderType: OrderTypeCTrader) => {
  switch (orderType) {
    case OrderTypeCTrader.LIMIT:
      return OrderType.limit;
    case OrderTypeCTrader.STOP:
      return OrderType.stop;
    default:
      return OrderType.market;
  }
};

const transformPosition = (
  position: any,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const orderType = transformOrderType(position.orderType);
  const direction = position.tradeSide === TradeSide.BUY ? Direction.buy : Direction.sell;
  const lot = getLotFromVolume({
    providerType,
    symbol: position.symbol,
    volume: position.volume,
    prices: symbolIds,
  }).lot || 0;
  return {
    positionId: position.positionId,

    providerId,
    providerType,
    providerPlatform: ProviderPlatform.ctrader,
    orderType,
    status: OrderStatus.live,

    symbol: symbolIds[position.symbolId]?.symbol || position.symbolId,
    symbolId: position.symbolId,
    direction,
    volume: position.volume,
    lot,

    price: position.price,
    stopLoss: position.stopLoss,
    takeProfit: position.takeProfit,

    margin: position.usedMargin,
    commission: position.commission,
    swap: position.swap,
    comment: position.comment,
    label: position.label,

    providerData: position,

    updatedAt: position.updatedAt,
    createdAt: position.createdAt,
  };
};

const transformOrder = (
  order: any,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const orderType = transformOrderType(order.orderType);
  const direction = order.tradeSide === TradeSide.BUY ? Direction.buy : Direction.sell;
  const lot = getLotFromVolume({
    providerType,
    symbol: order.symbol,
    volume: order.volume,
    prices: symbolIds,
  }).lot || 0;
  return {
    orderId: order.orderId,
    positionId: order.positionId,

    providerId,
    providerType,
    providerPlatform: ProviderPlatform.ctrader,
    orderType,
    status: OrderStatus.pending,

    symbol: symbolIds[order.symbolId]?.symbol || order.symbolId,
    symbolId: order.symbolId,
    direction,
    volume: order.volume,
    lot,

    limitPrice: order.limitPrice,
    stopPrice: order.stopPrice,
    stopLoss: order.stopLoss,
    takeProfit: order.takeProfit,

    comment: order.comment,
    label: order.label,

    providerData: order,

    updatedAt: order.updatedAt,
    createdAt: order.createdAt,
  };
};

const transformDeal = (
  deal: any,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const orderType = transformOrderType(deal.orderType);
  const lot = getLotFromVolume({
    providerType,
    symbol: deal.symbol,
    volume: deal.volume,
    prices: symbolIds,
  }).lot || 0;
  const {
    direction, price, priceClose, volumeClose,
  } = deal.closedVolume ? {
    direction: deal.tradeSide === TradeSide.BUY ? Direction.sell : Direction.buy,
    price: deal.entryPrice,
    priceClose: deal.executionPrice,
    volumeClose: deal.closedVolume,
  } : {
    direction: deal.tradeSide === TradeSide.BUY ? Direction.buy : Direction.sell,
    price: deal.executionPrice,
    priceClose: undefined,
    volumeClose: undefined,
  };
  const profit = (deal.grossProfit || 0) + (deal.swap || 0)
    + (deal.commission || 0) + (deal.commissionClose || 0);
  return {
    dealId: deal.dealId,
    orderId: deal.orderId,
    positionId: deal.positionId,

    providerId,
    providerType,
    providerPlatform: ProviderPlatform.ctrader,
    orderType,
    // status can be live or closed

    symbol: symbolIds[deal.symbolId]?.symbol || deal.symbolId,
    symbolId: deal.symbolId,
    direction,
    volume: deal.filledVolume,
    lot,

    price,
    ...(priceClose && { priceClose }),
    ...(volumeClose && { volumeClose }),

    commission: deal.commission,
    commissionClose: deal.closedCommission,
    swap: deal.swap,

    grossProfit: deal.grossProfit,
    profit,
    balance: deal.balance,

    providerData: deal,

    updatedAt: deal.updatedAt,
    createdAt: deal.createdAt,
  };
};

export {
  transformDeal,
  transformOrder,
  transformPosition,
};
