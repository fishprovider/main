import { PayloadType, TrendbarPeriod } from '~constants/openApi';
import type { Bar } from '~types/Bar.model';
import type { ConnectionType } from '~types/Connection.model';
import { transformBar } from '~utils/transform';
import validate from '~utils/validate';

interface GetTrendbarsRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  period: TrendbarPeriod;
  timestamp: number;
  trendbar: Bar[];
  symbolId?: Long;
}

const getBarData = async (
  connection: ConnectionType,
  symbolId: string,
  period: TrendbarPeriod,
  fromTimestamp: number,
  toTimestamp: number,
) => {
  const res = await connection.sendGuaranteedCommand<GetTrendbarsRes>({
    name: 'ProtoOAGetTrendbarsReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      period,
      fromTimestamp,
      toTimestamp,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_GET_TRENDBARS_RES,
      required: ['ctidTraderAccountId', 'period', 'timestamp'],
    },
    res,
  );

  const { trendbar } = res;
  return {
    ...res,
    bar: trendbar.map(transformBar),
  };
};

export default getBarData;
