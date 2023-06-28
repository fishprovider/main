import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface AccountAuthRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const authorizeAccount = async (
  connection: ConnectionType,
  accessToken?: string,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<AccountAuthRes>({
    name: 'ProtoOAAccountAuthReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      accessToken: accessToken || connection.accessToken,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_ACCOUNT_AUTH_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export default authorizeAccount;
