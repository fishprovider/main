import { PayloadType } from '~constants/openApi';
import { transformAccountInfo } from '~utils/transform';
import validate from '~utils/validate';
const getAccountInformation = async (connection, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOATraderReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_TRADER_RES,
        required: ['ctidTraderAccountId', 'trader'],
    }, res);
    const { trader } = res;
    return {
        ...res,
        ...transformAccountInfo(trader),
    };
};
export default getAccountInformation;
