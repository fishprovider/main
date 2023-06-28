/// <reference types="long" />
import type { CallbackType, CommonErrorCode, ErrorCode, ExecutionType, PayloadType } from '~constants/openApi';
import type { AccountInfo, DepositWithdraw, MarginCall } from './Account.model';
import type { Bar } from './Bar.model';
import type { Deal } from './Deal.model';
import type { Depth } from './Depth.model';
import type { Order, Position } from './Order.model';
interface CallbackPayload extends Record<string, any> {
    type: CallbackType;
}
interface BaseEvent {
    payloadType: PayloadType;
    ctidTraderAccountId: Long;
}
interface ExecutionEvent extends BaseEvent {
    executionType: ExecutionType;
    position?: Position;
    order?: Order;
    deal?: Deal;
    depositWithdraw?: DepositWithdraw;
    errorCode?: ErrorCode | CommonErrorCode;
    isServerEvent?: boolean;
}
interface TraderUpdatedEvent extends BaseEvent {
    trader: AccountInfo;
}
interface MarginCallTriggerEvent extends BaseEvent {
    marginCall: MarginCall;
}
interface SymbolChangedEvent extends BaseEvent {
    symbolId: Long[];
}
interface SpotEvent extends BaseEvent {
    symbolId: Long;
    bid?: Long;
    ask?: Long;
    trendbar: Bar[];
    sessionClose?: Long;
    timestamp?: Long;
}
interface DepthEvent extends BaseEvent {
    symbolId: Long;
    newQuotes: Depth[];
    deletedQuotes: Long[];
}
interface AccountsTokenInvalidatedEvent {
    payloadType: PayloadType;
    ctidTraderAccountIds: Long[];
    reason?: string;
}
interface Event {
    payloadType: PayloadType;
    payload: ExecutionEvent | TraderUpdatedEvent | MarginCallTriggerEvent | SymbolChangedEvent | SpotEvent | DepthEvent | AccountsTokenInvalidatedEvent;
}
export type { AccountsTokenInvalidatedEvent, BaseEvent, CallbackPayload, DepthEvent, Event, ExecutionEvent, MarginCallTriggerEvent, SpotEvent, SymbolChangedEvent, TraderUpdatedEvent, };
