import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { Asset } from '~types/Symbol.model';
import validate from '~utils/validate';

interface AssetListRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  asset: Asset[];
}

const getAssetList = async (
  connection: ConnectionType,
) => {
  const res = await connection.sendGuaranteedCommand<AssetListRes>({
    name: 'ProtoOAAssetListReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_ASSET_LIST_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );

  const { asset } = res;
  return {
    ...res,
    assets: asset.map((item) => {
      const { name, assetId } = item;
      return {
        ...item,
        asset: name,
        assetId: assetId.toNumber().toString(),
      };
    }),
  };
};

export default getAssetList;
