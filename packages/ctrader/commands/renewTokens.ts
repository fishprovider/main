import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import validate from '~utils/validate';

interface RefreshTokenRes {
  payloadType: PayloadType;
  accessToken: string;
  tokenType: string;
  expiresIn: Long;
  refreshToken: string;
}

const renewTokens = async (
  connection: ConnectionType,
  refreshToken?: string,
) => {
  const res = await connection.sendGuaranteedCommand<RefreshTokenRes>({
    name: 'ProtoOARefreshTokenReq',
    payload: {
      refreshToken: refreshToken || connection.refreshToken,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_REFRESH_TOKEN_RES,
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

export default renewTokens;
