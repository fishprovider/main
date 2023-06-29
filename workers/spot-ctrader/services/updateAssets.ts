import getAssetList from '@fishbot/ctrader/commands/getAssetList';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import { saveAssets } from '@fishbot/swap/utils/price';
import type { ProviderType } from '@fishbot/utils/constants/account';

const updateAssets = async (connection: ConnectionType, providerType: ProviderType) => {
  Logger.info('Updating assets');
  const { assets } = await getAssetList(connection);
  await saveAssets(providerType, assets.map((item) => ({
    ...item,
    _id: `${providerType}-${item.asset}`,
    providerType,
    digits: item.digits || 0,
  })));
  Logger.info(`Updated ${assets.length} assets`);
};

export default updateAssets;
