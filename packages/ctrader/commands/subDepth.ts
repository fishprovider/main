import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface SubscribeDepthQuotesRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const subDepth = async (
  connection: ConnectionType,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<SubscribeDepthQuotesRes>({
    name: 'ProtoOASubscribeDepthQuotesReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default subDepth;
