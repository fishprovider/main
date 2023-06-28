import { PayloadType } from '~constants/openApi';
import type {
  AccountsTokenInvalidatedEvent,
  BaseEvent,
  CallbackPayload, DepthEvent, Event, ExecutionEvent,
  MarginCallTriggerEvent, SpotEvent, SymbolChangedEvent, TraderUpdatedEvent,
} from '~types/Event.model';

import handleEventAccount from './account';
import handleEventAccountDisconnect from './accountDisconnect';
import handleEventAppDisconnect from './appDisconnect';
import handleEventDepth from './depth';
import handleEventMargin from './margin';
import handleEventOrder from './order';
import handleEventPrice from './price';
import handleEventSymbol from './symbol';
import handleEventTokenInvalid from './tokenInvalid';
import handleEventUnhandled from './unhandled';

const handleEvents = (event: Event, callback: (_: CallbackPayload) => void) => {
  const { payloadType, payload } = event;

  switch (payloadType) {
    // app
    case PayloadType.HEARTBEAT_EVENT:
      break;
    case PayloadType.PROTO_OA_CLIENT_DISCONNECT_EVENT:
      handleEventAppDisconnect(payload as BaseEvent, callback);
      break;

      // accounts
    case PayloadType.PROTO_OA_ACCOUNT_DISCONNECT_EVENT:
      handleEventAccountDisconnect(payload as BaseEvent, callback);
      break;
    case PayloadType.PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT:
      handleEventTokenInvalid(payload as AccountsTokenInvalidatedEvent, callback);
      break;
    case PayloadType.PROTO_OA_TRADER_UPDATE_EVENT:
      handleEventAccount(payload as TraderUpdatedEvent, callback);
      break;
    case PayloadType.PROTO_OA_MARGIN_CALL_TRIGGER_EVENT:
      handleEventMargin(payload as MarginCallTriggerEvent, callback);
      break;

    // symbols and ticks
    case PayloadType.PROTO_OA_SYMBOL_CHANGED_EVENT:
      handleEventSymbol(payload as SymbolChangedEvent, callback);
      break;
    // pubsub
    case PayloadType.PROTO_OA_SPOT_EVENT:
      handleEventPrice(payload as SpotEvent, callback);
      break;
    case PayloadType.PROTO_OA_DEPTH_EVENT:
      handleEventDepth(payload as DepthEvent, callback);
      break;

    // orders
    case PayloadType.PROTO_OA_EXECUTION_EVENT:
      handleEventOrder(payload as ExecutionEvent, callback);
      break;

    default:
      handleEventUnhandled(event, callback);
  }
};

export default handleEvents;
