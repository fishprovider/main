import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { ExecutionEvent } from '~types/Event.model';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';

interface UpdateOrderOptions extends Record<string, any> {
  volume?: number,
  limitPrice?: number,
  stopPrice?: number,
  stopLoss?: number,
  takeProfit?: number,
}

const updateOrder = async (
  connection: ConnectionType,
  orderId: string,
  options: UpdateOrderOptions,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<ExecutionEvent>({
    name: 'ProtoOAAmendOrderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      orderId,
      ...options,
      ...(options.volume && { volume: options.volume * 100 }),
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

export default updateOrder;
