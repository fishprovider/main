import {
  CTraderAccountsTokenInvalidatedEvent,
  CTraderBaseEvent, CTraderCallbackPayload, CTraderCallbackType,
  CTraderMarginCallTriggerEvent, CTraderTraderUpdatedEvent,
  transformAccountInfo,
} from '..';

export const handleEventAccount = (
  payload: CTraderTraderUpdatedEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const { trader } = payload;
  callback({
    ...payload,
    ...transformAccountInfo(trader),
    type: CTraderCallbackType.account,
  });
};

export const handleEventAccountDisconnect = (
  payload: CTraderBaseEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const { ctidTraderAccountId } = payload;
  callback({
    ...payload,
    type: CTraderCallbackType.accountDisconnect,
    accountId: ctidTraderAccountId.toNumber().toString(),
  });
};

export const handleEventMargin = (
  payload: CTraderMarginCallTriggerEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const { ctidTraderAccountId, marginCall } = payload;
  const { utcLastUpdateTimestamp } = marginCall;
  callback({
    ...payload,
    ...marginCall,
    type: CTraderCallbackType.margin,
    accountId: ctidTraderAccountId.toNumber().toString(),
    utcLastUpdateTimestamp: utcLastUpdateTimestamp?.toNumber(),
  });
};

export const handleEventTokenInvalid = (
  payload: CTraderAccountsTokenInvalidatedEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const { ctidTraderAccountIds } = payload;
  callback({
    ...payload,
    type: CTraderCallbackType.tokenInvalid,
    accountIds: ctidTraderAccountIds.map((item) => item.toNumber().toString()),
  });
};
