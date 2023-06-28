import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const getAccountList = async (connection, accessToken) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAGetAccountListByAccessTokenReq',
        payload: {
            accessToken: accessToken || connection.accessToken,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES,
        required: ['accessToken'],
    }, res);
    const { ctidTraderAccount } = res;
    return {
        ...res,
        accounts: ctidTraderAccount.map((item) => {
            const { ctidTraderAccountId, traderLogin } = item;
            return {
                ...item,
                accountId: ctidTraderAccountId.toNumber().toString(),
                traderLogin: traderLogin?.toNumber().toString(),
            };
        }),
    };
};
export default getAccountList;
