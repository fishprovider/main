import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const unsubBar = async (connection, symbolId, period) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAUnsubscribeLiveTrendbarReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
            period,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default unsubBar;
