import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const subDepth = async (connection, symbolId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOASubscribeDepthQuotesReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default subDepth;
