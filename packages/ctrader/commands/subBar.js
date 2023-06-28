import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const subBar = async (connection, symbolId, period) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOASubscribeLiveTrendbarReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
            period,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default subBar;
