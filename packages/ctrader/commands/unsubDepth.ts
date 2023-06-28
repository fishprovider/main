import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface UnsubscribeDepthQuotesRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const unsubDepth = async (
  connection: ConnectionType,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<UnsubscribeDepthQuotesRes>({
    name: 'ProtoOAUnsubscribeDepthQuotesReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default unsubDepth;
