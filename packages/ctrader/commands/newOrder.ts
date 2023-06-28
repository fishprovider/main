import { OrderType, PayloadType, TradeSide } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { ExecutionEvent } from '~types/Event.model';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';

interface NewOrderOptions extends Record<string, any> {
  limitPrice?: number,
  stopPrice?: number,
  stopLoss?: number,
  takeProfit?: number,
  label?: string,
  comment?: string,
}

const newOrder = async (
  connection: ConnectionType,
  symbolId: string,
  orderType: OrderType,
  tradeSide: TradeSide,
  volume: number,
  options: NewOrderOptions,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<ExecutionEvent>({
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

export default newOrder;
