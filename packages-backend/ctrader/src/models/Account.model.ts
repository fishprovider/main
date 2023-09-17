import {
  CTraderAccessRights, CTraderAccountType, CTraderChangeBalanceType,
  CTraderLimitedRiskMarginCalculationStrategy, CTraderNotificationType,
  CTraderTotalMarginCalculationType,
} from '.';

export interface CTraderToken {
  accessToken: string;
  refreshToken: string;
  expireSec: number;
}

export interface CTraderAccount {
  isLive?: boolean;
  ctidTraderAccountId: Long;
  traderLogin?: Long;

  lastClosingDealTimestamp?: Long;
  lastBalanceUpdateTimestamp?: Long;
}

export interface CTraderAccountInfo {
  ctidTraderAccountId: Long;
  balance: Long;
  leverageInCents?: number;
  traderLogin?: Long;
  moneyDigits?: number;

  balanceVersion?: Long;
  managerBonus?: Long;
  ibBonus?: Long;
  nonWithdrawableBonus?: Long;
  accessRights?: CTraderAccessRights
  depositAssetId: Long;
  swapFree?: Long;
  totalMarginCalculationType?: CTraderTotalMarginCalculationType;
  maxLeverage?: number;
  accountType?: CTraderAccountType;
  brokerName?: string;
  registrationTimestamp?: number;
  isLimitedRisk?: boolean;
  limitedRiskMarginCalculationStrategy?: CTraderLimitedRiskMarginCalculationStrategy;
}

export interface CTraderDepositWithdraw {
  operationType: CTraderChangeBalanceType,
  balanceHistoryId: Long,
  balance: Long,
  delta: Long,
  changeBalanceTimestamp: Long,
  externalNote?: string,
  balanceVersion?: Long,
  equity?: Long,
  moneyDigits?: number,
}

export interface CTraderMarginCall {
  marginCallType: CTraderNotificationType
  marginLevelThreshold: number;
  utcLastUpdateTimestamp?: Long;
}
