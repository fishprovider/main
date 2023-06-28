import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { ExecutionEvent } from '~types/Event.model';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';

const cancelOrder = async (
  connection: ConnectionType,
  orderId: string,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<ExecutionEvent>({
    name: 'ProtoOACancelOrderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      orderId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
  };
};

export default cancelOrder;
