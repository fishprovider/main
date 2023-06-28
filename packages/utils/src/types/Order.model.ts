import type { ProviderPlatform, ProviderType } from '~constants/account';
import type { Direction, OrderStatus, OrderType } from '~constants/order';

interface Chat {
  message: string;
  chatType?: string;
  userId: string;
  userName: string;
  userPicture?: string;
  createdAt: Date;
}

interface OrderSettings {
  alarm?: boolean;
  reborn?: boolean;
  confidences?: Record<string, number>;
  lockSL?: number;
  lockSLAmt?: number;
  lock?: boolean;
  hide?: boolean;
  chats?: Chat[];
}

interface Order extends OrderSettings {
  _id: string;
  orderId?: string;
  positionId?: string;
  dealId?: string;

  copyId?: string;

  providerId: string;
  providerType: ProviderType;
  providerPlatform: ProviderPlatform;
  providerPlatformType?: string;

  orderType: OrderType;
  status: OrderStatus;

  symbol: string;
  symbolId?: string;
  direction: Direction;
  volume: number;
  lot?: number;

  price?: number;
  limitPrice?: number;
  stopPrice?: number;
  takeProfit?: number | null;
  stopLoss?: number | null;
  label?: string;
  comment?: string;
  margin?: number;
  commission?: number;
  swap?: number;

  priceClose?: number;
  volumeClose?: number;
  commissionClose?: number;
  grossProfit?: number;
  profit?: number;
  balance?: number;
  assetId?: string;
  asset?: string;
  conversionRate?: number;

  providerData?: Record<string, any>; // external
  updatedLogs?: Record<string, any>[];

  userId?: string;
  userEmail?: string;
  userName?: string;
  userPicture?: string;

  sourceType?: string;
  tag?: string;

  updatedAt?: Date;
  createdAt?: Date;
}

type OrderWithoutId = Omit<Order, '_id'>;

export type {
  Chat,
  Order,
  OrderSettings,
  OrderWithoutId,
};
