import { ClientPermissionScope, PayloadType } from '~constants/openApi';
import type { Account } from '~types/Account.model';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface GetAccountListByAccessTokenRes {
  payloadType: PayloadType;
  accessToken: string;
  permissionScope?: ClientPermissionScope;
  ctidTraderAccount: Account[]
}

const getAccountList = async (
  connection: ConnectionType,
  accessToken?: string,
) => {
  const res = await connection.sendGuaranteedCommand<GetAccountListByAccessTokenRes>({
    name: 'ProtoOAGetAccountListByAccessTokenReq',
    payload: {
      accessToken: accessToken || connection.accessToken,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES,
      required: ['accessToken'],
    },
    res,
  );

  const { ctidTraderAccount } = res;
  return {
    ...res,
    accounts: ctidTraderAccount.map((item) => {
      const { ctidTraderAccountId, traderLogin } = item;
      return {
        ...item,
        accountId: ctidTraderAccountId.toNumber().toString(),
        traderLogin: traderLogin?.toNumber().toString(),
      };
    }),
  };
};

export default getAccountList;
