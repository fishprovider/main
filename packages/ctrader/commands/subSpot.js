import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const subSpot = async (connection, symbolId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOASubscribeSpotsReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_SUBSCRIBE_SPOTS_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default subSpot;
