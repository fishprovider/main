import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface ApplicationAuthRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
}

const authorizeApplication = async (connection: ConnectionType) => {
  const res = await connection.sendGuaranteedCommand<ApplicationAuthRes>({
    name: 'ProtoOAApplicationAuthReq',
    payload: {
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_APPLICATION_AUTH_RES,
    },
    res,
  );
  return true;
};

export default authorizeApplication;
