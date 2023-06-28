import { PayloadType, TrendbarPeriod } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface SubscribeLiveTrendbarRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const subBar = async (
  connection: ConnectionType,
  symbolId: string,
  period: TrendbarPeriod,
) => {
  const res = await connection.sendGuaranteedCommand<SubscribeLiveTrendbarRes>({
    name: 'ProtoOASubscribeLiveTrendbarReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      period,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default subBar;
