import { PayloadType } from '~constants/openApi';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';
const getAllPositionsAndOrders = async (connection, accountId) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAReconcileReq',
        payload: {
            ctidTraderAccountId: accountId || connection.accountId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_RECONCILE_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    const { position, order } = res;
    return {
        ...res,
        positions: position.map(transformPosition),
        orders: order.map(transformOrder),
    };
};
export default getAllPositionsAndOrders;
