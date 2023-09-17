import {
  CTraderDealStatus,
  CTraderOrderStatus, CTraderOrderType, CTraderPositionStatus, CTraderTradeSide,
} from '.';

export interface CTraderTradeData {
  symbolId: Long;
  volume: Long;
  tradeSide: CTraderTradeSide;
  openTimestamp?: Long;
  label?: string;
  guaranteedStopLoss?: boolean;
  comment?: string;
}

export interface CTraderOrder {
  orderId: Long;
  tradeData: CTraderTradeData;
  orderType: CTraderOrderType;
  orderStatus: CTraderOrderStatus;
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
  // timeInForce
  positionId: Long;
  relativeStopLoss?: Long;
  relativeTakeProfit?: Long;
  isStopOut?: number;
  trailingStopLoss?: boolean;
  // stopLossTriggerMethod
}

export interface CTraderPosition {
  positionId: Long;
  tradeData: CTraderTradeData;
  positionStatus: CTraderPositionStatus;
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
  // stopLossTriggerMethod
  moneyDigits?: number;
  trailingStopLoss?: boolean;
}

export interface CTraderClosePositionDetail {
  entryPrice: number;
  grossProfit: Long;
  swap: Long;
  commission: Long;
  balance: Long;
  quoteToDepositConversionRate?: number;
  closedVolume?: Long;
  balanceVersion?: Long;
  moneyDigits?: number;
  pnlConversionFee?: Long;
}

export interface CTraderDeal {
  dealId: Long;
  orderId: Long;
  positionId: Long;
  volume: Long;
  filledVolume: Long;
  symbolId: Long;
  createTimestamp: Long;
  executionTimestamp: Long;
  utcLastUpdateTimestamp?: Long;
  executionPrice?: number;
  tradeSide: CTraderTradeSide;
  dealStatus: CTraderDealStatus;
  marginRate?: number;
  commission?: Long;
  baseToUsdConversionRate?: number;
  closePositionDetail?: CTraderClosePositionDetail;
  moneyDigits?: number;
}
