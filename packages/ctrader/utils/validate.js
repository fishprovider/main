import { ErrorCode, PayloadType } from '~constants/openApi';
const isMarketClosed = (errMsg) => errMsg?.includes('MARKET_CLOSED');
const getErrMsg = (res) => {
    const { errorCode, description, reason, maintenanceEndTimestamp, orderId, positionId, } = res;
    return `Error code: ${errorCode}, description: ${description}, reason: ${reason}, maintenanceEndTimestamp: ${maintenanceEndTimestamp}, orderId: ${orderId}, positionId: ${positionId}`;
};
const checkHandler = (res) => {
    if (!res)
        return 'Empty response';
    const { payloadType, errorCode } = res;
    switch (payloadType) {
        case PayloadType.PROTO_OA_ERROR_RES:
            return `[ProtoOAErrorRes] ${getErrMsg(res)}`;
        case PayloadType.PROTO_OA_ORDER_ERROR_EVENT:
            return `[ProtoOAOrderErrorEvent] ${getErrMsg(res)}`;
        case PayloadType.PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT:
            return `[ProtoOAAccountsTokenInvalidatedEvent] ${getErrMsg(res)}`;
        case PayloadType.PROTO_OA_CLIENT_DISCONNECT_EVENT:
            return `[ProtoOAClientDisconnectEvent] ${getErrMsg(res)}`;
        default: {
            if (!errorCode) {
                return '';
            }
            switch (errorCode) {
                case ErrorCode.CH_ACCESS_TOKEN_INVALID:
                    return `[AccessTokenInvalidEvent] ${getErrMsg(res)}`;
                default:
                    return `Unhandled errorCode ${errorCode}, ${getErrMsg(res)}`;
            }
        }
    }
};
const validate = (expected, res) => {
    const errMsg = checkHandler(res);
    if (errMsg) {
        throw new Error(errMsg);
    }
    if (res.payloadType !== expected.payloadType) {
        throw new Error(`Expected payloadType: ${expected.payloadType}, received: ${res.payloadType}`);
    }
    if (expected.required) {
        const missing = expected.required.filter((field) => {
            const val = res[field];
            return !val && val !== false;
        });
        if (missing.length) {
            throw new Error(`Missing fields: ${missing.join(', ')}`);
        }
    }
};
export default validate;
export { isMarketClosed };
