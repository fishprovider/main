import {
  CTraderAccountInfo, CTraderBar, CTraderCommonErrorCode, CTraderDeal, CTraderDepositWithdraw,
  CTraderDepth, CTraderErrorCode, CTraderExecutionType,
  CTraderMarginCall, CTraderOrder, CTraderPayloadType,
  CTraderPosition,
} from '.';

export enum CTraderCallbackType {
  'appDisconnect' = 'appDisconnect',
  'accountDisconnect' = 'accountDisconnect',
  'tokenInvalid' = 'tokenInvalid',
  'account' = 'account',
  'margin' = 'margin',
  'symbol' = 'symbol',
  'price' = 'price',
  'depth' = 'depth',
  'order' = 'order',
  'unhandled' = 'unhandled',
}

export interface CTraderCallbackPayload extends Record<string, any> {
  type: CTraderCallbackType;
}

export interface CTraderBaseEvent {
  payloadType: CTraderPayloadType;
  ctidTraderAccountId: Long;
}

export interface CTraderExecutionEvent extends CTraderBaseEvent {
  executionType: CTraderExecutionType
  position?: CTraderPosition;
  order?: CTraderOrder;
  deal?: CTraderDeal;
  // bonusDepositWithdraw?: BonusDepositWithdraw;
  depositWithdraw?: CTraderDepositWithdraw;
  errorCode?: CTraderErrorCode | CTraderCommonErrorCode;
  isServerEvent?: boolean;
}

export interface CTraderTraderUpdatedEvent extends CTraderBaseEvent {
  trader: CTraderAccountInfo;
}

export interface CTraderMarginCallTriggerEvent extends CTraderBaseEvent {
  marginCall: CTraderMarginCall;
}

export interface CTraderSymbolChangedEvent extends CTraderBaseEvent {
  symbolId: Long[];
}

export interface CTraderSpotEvent extends CTraderBaseEvent {
  symbolId: Long;
  bid?: Long;
  ask?: Long;
  trendbar: CTraderBar[];
  sessionClose?: Long;
  timestamp?: Long;
}

export interface CTraderDepthEvent extends CTraderBaseEvent {
  symbolId: Long;
  newQuotes: CTraderDepth[];
  deletedQuotes: Long[];
}

export interface CTraderAccountsTokenInvalidatedEvent {
  payloadType: CTraderPayloadType;
  ctidTraderAccountIds: Long[];
  reason?: string;
}

export interface CTraderEvent {
  payloadType: CTraderPayloadType;
  payload: CTraderExecutionEvent
  | CTraderTraderUpdatedEvent
  | CTraderMarginCallTriggerEvent
  | CTraderSymbolChangedEvent
  | CTraderSpotEvent
  | CTraderDepthEvent
  | CTraderAccountsTokenInvalidatedEvent;
}
