import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const renewTokens = async (connection, refreshToken) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOARefreshTokenReq',
        payload: {
            refreshToken: refreshToken || connection.refreshToken,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_REFRESH_TOKEN_RES,
        required: ['accessToken', 'refreshToken'],
    }, res);
    const { expiresIn } = res;
    return {
        ...res,
        expiresIn: expiresIn.toNumber(),
    };
};
export default renewTokens;
