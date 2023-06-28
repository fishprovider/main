import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const authorizeApplication = async (connection) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAApplicationAuthReq',
        payload: {
            clientId: connection.clientId,
            clientSecret: connection.clientSecret,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_APPLICATION_AUTH_RES,
    }, res);
    return true;
};
export default authorizeApplication;
