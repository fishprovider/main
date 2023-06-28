import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface UnsubscribeSpotsRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const unsubSpot = async (
  connection: ConnectionType,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<UnsubscribeSpotsRes>({
    name: 'ProtoOAUnsubscribeSpotsReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_UNSUBSCRIBE_SPOTS_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default unsubSpot;
