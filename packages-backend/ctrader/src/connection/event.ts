import {
  CTraderAccountsTokenInvalidatedEvent,
  CTraderBaseEvent, CTraderCallbackPayload, CTraderDepthEvent, CTraderEvent,
  CTraderExecutionEvent, CTraderMarginCallTriggerEvent, CTraderPayloadType,
  CTraderSpotEvent, CTraderSymbolChangedEvent, CTraderTraderUpdatedEvent,
  handleEventAccount, handleEventAccountDisconnect, handleEventAppDisconnect,
  handleEventDepth, handleEventMargin, handleEventOrder,
  handleEventPrice, handleEventSymbol,
  handleEventTokenInvalid, handleEventUnhandled,
} from '..';

export const handleEvent = (
  event: CTraderEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const { payloadType, payload } = event;

  switch (payloadType) {
    // app
    case CTraderPayloadType.HEARTBEAT_EVENT:
      break;
    case CTraderPayloadType.PROTO_OA_CLIENT_DISCONNECT_EVENT:
      handleEventAppDisconnect(payload as CTraderBaseEvent, callback);
      break;

      // accounts
    case CTraderPayloadType.PROTO_OA_ACCOUNT_DISCONNECT_EVENT:
      handleEventAccountDisconnect(payload as CTraderBaseEvent, callback);
      break;
    case CTraderPayloadType.PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT:
      handleEventTokenInvalid(payload as CTraderAccountsTokenInvalidatedEvent, callback);
      break;
    case CTraderPayloadType.PROTO_OA_TRADER_UPDATE_EVENT:
      handleEventAccount(payload as CTraderTraderUpdatedEvent, callback);
      break;
    case CTraderPayloadType.PROTO_OA_MARGIN_CALL_TRIGGER_EVENT:
      handleEventMargin(payload as CTraderMarginCallTriggerEvent, callback);
      break;

    // symbols and ticks
    case CTraderPayloadType.PROTO_OA_SYMBOL_CHANGED_EVENT:
      handleEventSymbol(payload as CTraderSymbolChangedEvent, callback);
      break;
    // pubsub
    case CTraderPayloadType.PROTO_OA_SPOT_EVENT:
      handleEventPrice(payload as CTraderSpotEvent, callback);
      break;
    case CTraderPayloadType.PROTO_OA_DEPTH_EVENT:
      handleEventDepth(payload as CTraderDepthEvent, callback);
      break;

    // orders
    case CTraderPayloadType.PROTO_OA_EXECUTION_EVENT:
      handleEventOrder(payload as CTraderExecutionEvent, callback);
      break;

    default:
      handleEventUnhandled(event, callback);
  }
};
