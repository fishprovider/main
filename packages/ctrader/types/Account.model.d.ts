/// <reference types="long" />
import type { AccessRights, AccountType, ChangeBalanceType, LimitedRiskMarginCalculationStrategy, NotificationType, TotalMarginCalculationType } from '~constants/openApi';
interface Account {
    isLive?: boolean;
    ctidTraderAccountId: Long;
    traderLogin?: Long;
    lastClosingDealTimestamp?: Long;
    lastBalanceUpdateTimestamp?: Long;
}
interface AccountInfo {
    ctidTraderAccountId: Long;
    balance: Long;
    leverageInCents?: number;
    traderLogin?: Long;
    moneyDigits?: number;
    balanceVersion?: Long;
    managerBonus?: Long;
    ibBonus?: Long;
    nonWithdrawableBonus?: Long;
    accessRights?: AccessRights;
    depositAssetId: Long;
    swapFree?: Long;
    totalMarginCalculationType?: TotalMarginCalculationType;
    maxLeverage?: number;
    accountType?: AccountType;
    brokerName?: string;
    registrationTimestamp?: number;
    isLimitedRisk?: boolean;
    limitedRiskMarginCalculationStrategy?: LimitedRiskMarginCalculationStrategy;
}
interface DepositWithdraw {
    operationType: ChangeBalanceType;
    balanceHistoryId: Long;
    balance: Long;
    delta: Long;
    changeBalanceTimestamp: Long;
    externalNote?: string;
    balanceVersion?: Long;
    equity?: Long;
    moneyDigits?: number;
}
interface MarginCall {
    marginCallType: NotificationType;
    marginLevelThreshold: number;
    utcLastUpdateTimestamp?: Long;
}
export type { Account, AccountInfo, DepositWithdraw, MarginCall, };
