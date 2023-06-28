import { PayloadType } from '~constants/openApi';
import type { AccountInfo } from '~types/Account.model';
import type { ConnectionType } from '~types/Connection.model';
import { transformAccountInfo } from '~utils/transform';
import validate from '~utils/validate';

interface TraderRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  trader: AccountInfo
}

const getAccountInformation = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<TraderRes>({
    name: 'ProtoOATraderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_TRADER_RES,
      required: ['ctidTraderAccountId', 'trader'],
    },
    res,
  );

  const { trader } = res;
  return {
    ...res,
    ...transformAccountInfo(trader),
  };
};

export default getAccountInformation;
