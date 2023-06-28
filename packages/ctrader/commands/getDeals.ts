import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { Deal } from '~types/Deal.model';
import { transformDeal } from '~utils/transform';
import validate from '~utils/validate';

interface DealListRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  deal: Deal[];
  hasMore: boolean;
}

const getDeals = async (
  connection: ConnectionType,
  fromTimestamp: number,
  toTimestamp: number,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<DealListRes>({
    name: 'ProtoOADealListReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      fromTimestamp,
      toTimestamp,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_DEAL_LIST_RES,
      required: ['ctidTraderAccountId', 'hasMore'],
    },
    res,
  );

  const { deal } = res;
  return {
    ...res,
    deals: deal.map(transformDeal),
  };
};

export default getDeals;
