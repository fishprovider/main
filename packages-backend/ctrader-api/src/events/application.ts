import {
  CTraderBaseEvent, CTraderCallbackPayload, CTraderCallbackType, CTraderEvent,
} from '..';

export const handleEventAppDisconnect = (
  payload: CTraderBaseEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  callback({
    ...payload,
    type: CTraderCallbackType.appDisconnect,
  });
};

export const handleEventUnhandled = (
  event: CTraderEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  callback({
    type: CTraderCallbackType.unhandled,
    event,
  });
};
