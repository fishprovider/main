import { PayloadType } from '~constants/openApi';
import { transformBar } from '~utils/transform';
import validate from '~utils/validate';
const getBarData = async (connection, symbolId, period, fromTimestamp, toTimestamp) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAGetTrendbarsReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
            period,
            fromTimestamp,
            toTimestamp,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_GET_TRENDBARS_RES,
        required: ['ctidTraderAccountId', 'period', 'timestamp'],
    }, res);
    const { trendbar } = res;
    return {
        ...res,
        bar: trendbar.map(transformBar),
    };
};
export default getBarData;
