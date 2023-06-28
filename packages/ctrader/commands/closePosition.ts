import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { ExecutionEvent } from '~types/Event.model';
import { transformDeal, transformOrder, transformPosition } from '~utils/transform';
import validate from '~utils/validate';

const closePosition = async (
  connection: ConnectionType,
  positionId: string,
  volume: number,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<ExecutionEvent>({
    name: 'ProtoOAClosePositionReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      positionId,
      volume: volume * 100,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order, deal } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
    deal: deal && transformDeal(deal),
  };
};

export default closePosition;
