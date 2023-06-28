import { PayloadType, TrendbarPeriod } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface UnsubscribeLiveTrendbarRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const unsubBar = async (
  connection: ConnectionType,
  symbolId: string,
  period: TrendbarPeriod,
) => {
  const res = await connection.sendGuaranteedCommand<UnsubscribeLiveTrendbarRes>({
    name: 'ProtoOAUnsubscribeLiveTrendbarReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      period,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default unsubBar;
