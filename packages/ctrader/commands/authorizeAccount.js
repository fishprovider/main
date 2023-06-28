import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const authorizeAccount = async (connection, accessToken, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAAccountAuthReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
            accessToken: accessToken || connection.accessToken,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_ACCOUNT_AUTH_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default authorizeAccount;
