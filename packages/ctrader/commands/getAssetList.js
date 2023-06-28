import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const getAssetList = async (connection) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOAAssetListReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_ASSET_LIST_RES,
        required: ['ctidTraderAccountId'],
    }, res);
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
