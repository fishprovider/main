import { PayloadType } from '~constants/openApi';
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
const handleEvents = (event, callback) => {
    const { payloadType, payload } = event;
    switch (payloadType) {
        // app
        case PayloadType.HEARTBEAT_EVENT:
            break;
        case PayloadType.PROTO_OA_CLIENT_DISCONNECT_EVENT:
            handleEventAppDisconnect(payload, callback);
            break;
        // accounts
        case PayloadType.PROTO_OA_ACCOUNT_DISCONNECT_EVENT:
            handleEventAccountDisconnect(payload, callback);
            break;
        case PayloadType.PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT:
            handleEventTokenInvalid(payload, callback);
            break;
        case PayloadType.PROTO_OA_TRADER_UPDATE_EVENT:
            handleEventAccount(payload, callback);
            break;
        case PayloadType.PROTO_OA_MARGIN_CALL_TRIGGER_EVENT:
            handleEventMargin(payload, callback);
            break;
        // symbols and ticks
        case PayloadType.PROTO_OA_SYMBOL_CHANGED_EVENT:
            handleEventSymbol(payload, callback);
            break;
        // pubsub
        case PayloadType.PROTO_OA_SPOT_EVENT:
            handleEventPrice(payload, callback);
            break;
        case PayloadType.PROTO_OA_DEPTH_EVENT:
            handleEventDepth(payload, callback);
            break;
        // orders
        case PayloadType.PROTO_OA_EXECUTION_EVENT:
            handleEventOrder(payload, callback);
            break;
        default:
            handleEventUnhandled(event, callback);
    }
};
export default handleEvents;
