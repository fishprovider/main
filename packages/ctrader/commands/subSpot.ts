import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface SubscribeSpotsRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const subSpot = async (
  connection: ConnectionType,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<SubscribeSpotsRes>({
    name: 'ProtoOASubscribeSpotsReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_SUBSCRIBE_SPOTS_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default subSpot;
