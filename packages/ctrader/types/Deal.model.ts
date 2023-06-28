import type { DealStatus, TradeSide } from '~constants/openApi';

interface ClosePositionDetail {
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

interface Deal {
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
  tradeSide: TradeSide;
  dealStatus: DealStatus;
  marginRate?: number;
  commission?: Long;
  baseToUsdConversionRate?: number;
  closePositionDetail?: ClosePositionDetail;
  moneyDigits?: number;
}

export type {
  ClosePositionDetail,
  Deal,
};
