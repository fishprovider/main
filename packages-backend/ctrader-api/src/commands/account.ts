import {
  CTraderAccount, CTraderAccountInfo, CTraderClientPermissionScope,
  CTraderPayloadType, TCTraderConnection,
  transformAccountInfo, validate,
} from '..';

export const authorizeAccount = async (
  connection: TCTraderConnection,
  accessToken?: string,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOAAccountAuthReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      accessToken: accessToken || connection.accessToken,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_ACCOUNT_AUTH_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export const getAccountInformation = async (
  connection: TCTraderConnection,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    trader: CTraderAccountInfo
  }>({
    name: 'ProtoOATraderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_TRADER_RES,
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

export const getAccountList = async (
  connection: TCTraderConnection,
  accessToken?: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    accessToken: string;
    permissionScope?: CTraderClientPermissionScope;
    ctidTraderAccount: CTraderAccount[]
  }>({
    name: 'ProtoOAGetAccountListByAccessTokenReq',
    payload: {
      accessToken: accessToken || connection.accessToken,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES,
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

export const renewTokens = async (
  connection: TCTraderConnection,
  refreshToken?: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    accessToken: string;
    tokenType: string;
    expiresIn: Long;
    refreshToken: string;
  }>({
    name: 'ProtoOARefreshTokenReq',
    payload: {
      refreshToken: refreshToken || connection.refreshToken,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_REFRESH_TOKEN_RES,
      required: ['accessToken', 'refreshToken'],
    },
    res,
  );

  const { expiresIn } = res;
  return {
    ...res,
    expiresIn: expiresIn.toNumber(),
  };
};
