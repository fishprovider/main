/// <reference types="long" />
import type { OrderStatus, OrderType, PositionStatus, TradeSide } from '~constants/openApi';
interface TradeData {
    symbolId: Long;
    volume: Long;
    tradeSide: TradeSide;
    openTimestamp?: Long;
    label?: string;
    guaranteedStopLoss?: boolean;
    comment?: string;
}
interface Order {
    orderId: Long;
    tradeData: TradeData;
    orderType: OrderType;
    orderStatus: OrderStatus;
    expirationTimestamp?: Long;
    executionPrice?: number;
    executedVolume?: Long;
    utcLastUpdateTimestamp?: Long;
    baseSlippagePrice?: number;
    slippageInPoints?: Long;
    closingOrder?: number;
    limitPrice?: number;
    stopPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    clientOrderId?: string;
    positionId: Long;
    relativeStopLoss?: Long;
    relativeTakeProfit?: Long;
    isStopOut?: number;
    trailingStopLoss?: boolean;
}
interface Position {
    positionId: Long;
    tradeData: TradeData;
    positionStatus: PositionStatus;
    swap: Long;
    price?: number;
    stopLoss?: number;
    takeProfit?: number;
    utcLastUpdateTimestamp?: Long;
    commission?: Long;
    marginRate?: number;
    mirroringCommission: Long;
    guaranteedStopLoss?: boolean;
    usedMargin?: Long;
    moneyDigits?: number;
    trailingStopLoss?: boolean;
}
export type { Order, Position, TradeData, };
