import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const unsubDepth = async (connection, symbolId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAUnsubscribeDepthQuotesReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default unsubDepth;
