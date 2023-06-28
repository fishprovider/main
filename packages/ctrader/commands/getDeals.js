import { PayloadType } from '~constants/openApi';
import { transformDeal } from '~utils/transform';
import validate from '~utils/validate';
const getDeals = async (connection, fromTimestamp, toTimestamp, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOADealListReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
            fromTimestamp,
            toTimestamp,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_DEAL_LIST_RES,
        required: ['ctidTraderAccountId', 'hasMore'],
    }, res);
    const { deal } = res;
    return {
        ...res,
        deals: deal.map(transformDeal),
    };
};
export default getDeals;
