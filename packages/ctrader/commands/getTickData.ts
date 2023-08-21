import { PayloadType, QuoteType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { Tick } from '~types/Tick.model';
import { transformTick } from '~utils/transform';
import validate from '~utils/validate';

interface GetTickRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  tickData: Tick[];
  hasMore: boolean;
}

const getTickData = async (
  connection: ConnectionType,
  symbolId: string,
  quoteType: QuoteType,
  fromTimestamp: number,
  toTimestamp: number,
) => {
  const res = await connection.sendGuaranteedCommand<GetTickRes>({
    name: 'ProtoOAGetTickDataReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      type: quoteType,
      fromTimestamp,
      toTimestamp,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_GET_TICKDATA_RES,
      required: ['ctidTraderAccountId', 'tickData', 'hasMore'],
    },
    res,
  );

  const { tickData } = res;
  return {
    ...res,
    ticks: tickData.map(transformTick),
  };
};

export default getTickData;
