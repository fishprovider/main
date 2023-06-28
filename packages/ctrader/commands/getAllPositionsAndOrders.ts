import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { Order, Position } from '~types/Order.model';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';

interface ReconcileRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  position: Position[]
  order: Order[]
}

const getAllPositionsAndOrders = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<ReconcileRes>({
    name: 'ProtoOAReconcileReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_RECONCILE_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    positions: position.map(transformPosition),
    orders: order.map(transformOrder),
  };
};

export default getAllPositionsAndOrders;
