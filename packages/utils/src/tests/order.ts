import { ProviderPlatform, ProviderType } from '~constants/account';
import { Direction, OrderStatus, OrderType } from '~constants/order';
import type { Order } from '~types/Order.model';

const getOrderDefault: () => Order = () => ({
  _id: 'testOrderId',
  providerType: ProviderType.icmarkets,
  providerPlatform: ProviderPlatform.ctrader,
  providerId: 'testAccountId',
  orderType: OrderType.market,
  status: OrderStatus.idea,

  symbol: 'EURUSD',
  direction: Direction.buy,
  volume: 1000,
  price: 1.23456,
});

const getOrder = ({
  providerType,
  orderType,
  symbol, direction, volume,
  price,
  limitPrice,
}: {
  providerType?: ProviderType;
  orderType?: OrderType;
  symbol?: string;
  direction?: Direction;
  volume?: number;
  price?: number;
  limitPrice?: number;
} = {}) => {
  const order = getOrderDefault();

  if (providerType) order.providerType = providerType;
  if (orderType) order.orderType = orderType;

  if (symbol) order.symbol = symbol;
  if (direction) order.direction = direction;
  if (volume) order.volume = volume;

  if (price) order.price = price;
  if (limitPrice) order.limitPrice = limitPrice;

  return order;
};

export {
  getOrder,
  getOrderDefault,
};
