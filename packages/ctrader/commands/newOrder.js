import { PayloadType } from '~constants/openApi';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';
const newOrder = async (connection, symbolId, orderType, tradeSide, volume, options, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOANewOrderReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
            symbolId,
            orderType,
            tradeSide,
            volume: volume * 100,
            ...options,
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
export default newOrder;
