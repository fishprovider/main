import { Asset, ProviderType } from '@fishprovider/core';

import { BaseGetManyResult, BaseGetOptions } from '..';

export interface AssetRepository {
  getAssets?: (
    filter: {
      providerType: ProviderType,
    },
    options?: BaseGetOptions<Asset>,
  ) => Promise<BaseGetManyResult<Asset>>;
}
