import { PayloadType } from '~constants/openApi';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';
const updateOrder = async (connection, orderId, options, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAAmendOrderReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
            orderId,
            ...options,
            ...(options.volume && { volume: options.volume * 100 }),
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
export default updateOrder;
