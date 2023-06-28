import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const unsubSpot = async (connection, symbolId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAUnsubscribeSpotsReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_UNSUBSCRIBE_SPOTS_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    return true;
};
export default unsubSpot;
