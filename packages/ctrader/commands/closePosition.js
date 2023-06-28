import { PayloadType } from '~constants/openApi';
import { transformDeal, transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';
const closePosition = async (connection, positionId, volume, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAClosePositionReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
            positionId,
            volume: volume * 100,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_EXECUTION_EVENT,
        required: ['ctidTraderAccountId', 'executionType'],
    }, res);
    const { position, order, deal } = res;
    return {
        ...res,
        order: order && transformOrder(order),
        position: position && transformPosition(position),
        deal: deal && transformDeal(deal),
    };
};
export default closePosition;
