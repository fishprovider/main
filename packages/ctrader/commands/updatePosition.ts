import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { ExecutionEvent } from '~types/Event.model';
import { transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';

interface UpdatePositionOptions extends Record<string, any> {
  stopLoss?: number,
  takeProfit?: number,
}

const updatePosition = async (
  connection: ConnectionType,
  positionId: string,
  options: UpdatePositionOptions,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<ExecutionEvent>({
    name: 'ProtoOAAmendPositionSLTPReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      positionId,
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

export default updatePosition;
