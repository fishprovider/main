import { CTraderPayloadType, TCTraderConnection, validate } from '..';

export const authorizeApplication = async (connection: TCTraderConnection) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOAApplicationAuthReq',
    payload: {
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_APPLICATION_AUTH_RES,
    },
    res,
  );
  return true;
};

export const sendHeartbeat = async (connection: TCTraderConnection) => {
  await connection.sendGuaranteedCommand({
    name: 'ProtoHeartbeatEvent',
    payload: {},
  });
  return true;
};
