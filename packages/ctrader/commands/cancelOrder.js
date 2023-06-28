import { PayloadType } from '~constants/openApi';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';
const cancelOrder = async (connection, orderId, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOACancelOrderReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
            orderId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_EXECUTION_EVENT,
        required: ['ctidTraderAccountId', 'executionType'],
    }, res);
    const { position, order } = res;
    return {
        ...res,
        order: order && transformOrder(order),
        position: position && transformPosition(position),
    };
};
export default cancelOrder;
